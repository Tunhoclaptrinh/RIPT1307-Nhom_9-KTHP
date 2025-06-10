import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { message } from 'antd';
import * as XLSX from 'xlsx';
import { PhuongThucXT, TImportHeader, TImportResponse, TImportRowResponse } from '../services/PhuongThucXT/typing';

export default () => {
	const objInt = useInitModel<PhuongThucXT.IRecord>('phuongThucXetTuyen', undefined, undefined, ipLocal);

	// Import headers configuration
	const importHeaders: TImportHeader[] = [
		{
			field: 'ten',
			label: 'Tên phương thức xét tuyển',
			type: 'String',
			required: true
		},
		{
			field: 'nguyenTac',
			label: 'Nguyên tắc xét tuyển',
			type: 'String',
			required: true
		}
	];

	// Get import headers
	const getImportHeaderModel = async () => {
		return importHeaders;
	};

	// Get import template
	const getImportTemplateModel = async (): Promise<Blob> => {
		try {
			// Tạo template Excel với headers
			const templateData = [
				{
					'Tên phương thức xét tuyển': 'Xét tuyển theo điểm thi THPT',
					'Nguyên tắc xét tuyển': 'Xét theo tổng điểm 3 môn thi THPT Quốc gia'
				},
				{
					'Tên phương thức xét tuyển': 'Xét tuyển học bạ',
					'Nguyên tắc xét tuyển': 'Xét theo điểm trung bình học bạ THPT'
				}
			];

			const worksheet = XLSX.utils.json_to_sheet(templateData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

			// Tạo buffer và return blob
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([excelBuffer], { 
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
			});

			return blob;
		} catch (error) {
			console.error('Template generation error:', error);
			message.error('Có lỗi xảy ra khi tạo file mẫu!');
			throw error;
		}
	};

	// Validate import data
	const postValidateModel = async (data: any[]): Promise<TImportResponse> => {
		try {
			const validateResults: TImportRowResponse[] = [];
			
			for (let i = 0; i < data.length; i++) {
				const record = data[i];
				const errors: string[] = [];
				
				// Validate required fields
				if (!record.ten || record.ten.trim() === '') {
					errors.push('Tên phương thức xét tuyển không được để trống');
				}
				
				if (!record.nguyenTac || record.nguyenTac.trim() === '') {
					errors.push('Nguyên tắc xét tuyển không được để trống');
				}

				// Check for duplicates in current data
				const duplicateInData = data.findIndex((item, index) => 
					index !== i && 
					item.ten && 
					item.ten.trim().toLowerCase() === record.ten?.trim().toLowerCase()
				);
				
				if (duplicateInData !== -1) {
					errors.push(`Trùng tên với dòng ${duplicateInData + 1} trong file`);
				}

				// Check for existing records in database
				try {
					const response = await fetch(`${ipLocal}/phuongThucXetTuyen`);
					const existingRecords: PhuongThucXT.IRecord[] = await response.json();
					
					const existingRecord = existingRecords.find(existing => 
						existing.ten.trim().toLowerCase() === record.ten?.trim().toLowerCase()
					);
					
					if (existingRecord) {
						errors.push('Tên phương thức xét tuyển đã tồn tại trong hệ thống');
					}
				} catch (dbError) {
					console.error('Database check error:', dbError);
					errors.push('Không thể kiểm tra dữ liệu trong hệ thống');
				}

				validateResults.push({
					index: i,
					rowErrors: errors.length > 0 ? errors : undefined
				});
			}

			return {
				validate: validateResults,
				error: false
			};
		} catch (error) {
			console.error('Validation error:', error);
			return {
				validate: [],
				error: true
			};
		}
	};

	// Execute import
	const postExecuteImpotModel = async (data: any[]): Promise<TImportResponse> => {
		try {
			const executeResults: TImportRowResponse[] = [];
			let successCount = 0;
			
			for (let i = 0; i < data.length; i++) {
				const record = data[i];
				const errors: string[] = [];
				
				try {
					// Prepare data for API
					const payload = {
						ten: record.ten?.trim(),
						nguyenTac: record.nguyenTac?.trim()
					};

					// Call API to create record
					const response = await fetch(`${ipLocal}/phuongThucXetTuyen`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(payload)
					});

					if (!response.ok) {
						const errorData = await response.text();
						errors.push(`Lỗi API: ${errorData || response.statusText}`);
					} else {
						successCount++;
					}
				} catch (apiError) {
					console.error('API call error:', apiError);
					errors.push('Lỗi khi gọi API tạo dữ liệu');
				}

				executeResults.push({
					index: i,
					rowErrors: errors.length > 0 ? errors : undefined
				});
			}

			message.success(`Đã nhập thành công ${successCount}/${data.length} bản ghi!`);

			return {
				validate: executeResults,
				error: false
			};
		} catch (error) {
			console.error('Execute import error:', error);
			message.error('Có lỗi xảy ra khi thực hiện import!');
			return {
				validate: [],
				error: true
			};
		}
	};

	// Định nghĩa các trường có thể export
	const getExportFieldsModel = async () => {
		return [
			{
				_id: 'id',
				label: 'ID phương thức',
				labels: ['ID phương thức'],
				selected: true
			},
			{
				_id: 'ten',
				label: 'Tên phương thức xét tuyển',
				labels: ['Tên phương thức xét tuyển'],
				selected: true
			},
			{
				_id: 'nguyenTac',
				label: 'Nguyên tắc xét tuyển',
				labels: ['Nguyên tắc xét tuyển'],
				selected: true
			}
		];
	};

	// Hàm format dữ liệu trước khi export
	const formatDataForExport = async (data: PhuongThucXT.IRecord[], fields: any[]) => {
		const formattedData = [];
		
		for (const record of data) {
			const row: any = {};
			
			for (const field of fields) {
				switch (field._id) {
					case 'id':
						row['ID phương thức'] = record.id || '';
						break;
					case 'ten':
						row['Tên phương thức xét tuyển'] = record.ten || '';
						break;
					case 'nguyenTac':
						row['Nguyên tắc xét tuyển'] = record.nguyenTac || '';
						break;
				}
			}
			
			formattedData.push(row);
		}
		
		return formattedData;
	};

	// Hàm export dữ liệu
	const postExportModel = async (
		payload: any,
		condition?: any,
		filters?: any,
		otherQuery?: any
	) => {
		try {
			let dataToExport: PhuongThucXT.IRecord[] = [];
			
			// Nếu có selectedIds, lấy theo IDs đã chọn
			if (payload.ids && payload.ids.length > 0) {
				const promises = payload.ids.map((id: string) => 
					fetch(`${ipLocal}/phuongThucXetTuyen/${id}`).then(res => res.json())
				);
				dataToExport = await Promise.all(promises);
			} else {
				// Lấy toàn bộ dữ liệu
				const response = await fetch(`${ipLocal}/phuongThucXetTuyen`);
				dataToExport = await response.json();
				
				// Áp dụng filters nếu có
				if (filters && Object.keys(filters).length > 0) {
					dataToExport = dataToExport.filter(record => {
						return Object.entries(filters).every(([key, value]) => {
							if (!value) return true;
							const recordValue = record[key as keyof PhuongThucXT.IRecord];
							if (typeof recordValue === 'string') {
								return recordValue.toLowerCase().includes(value.toString().toLowerCase());
							}
							return recordValue === value;
						});
					});
				}
			}
			
			// Format dữ liệu theo các trường đã chọn
			const formattedData = await formatDataForExport(dataToExport, payload.definitions);
			
			// Tạo workbook Excel
			const worksheet = XLSX.utils.json_to_sheet(formattedData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Phương thức xét tuyển');
			
			// Tạo buffer và return blob
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([excelBuffer], { 
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
			});
			
			message.success(`Đã xuất ${formattedData.length} bản ghi thành công!`);
			return blob;
			
		} catch (error) {
			console.error('Export error:', error);
			message.error('Có lỗi xảy ra khi xuất dữ liệu!');
			throw error;
		}
	};

	return {
		...objInt,
		importHeaders,
		getImportHeaderModel,
		getImportTemplateModel,
		postValidateModel,
		postExecuteImpotModel,
		getExportFieldsModel,
		postExportModel,
	};
};