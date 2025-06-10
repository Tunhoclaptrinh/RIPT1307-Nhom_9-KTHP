import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { message } from 'antd';
import * as XLSX from 'xlsx';
import { NganhDaoTao, TImportHeader, TImportResponse, TImportRowResponse } from '../services/NganhDaoTao/typing';

export default () => {
	const objInt = useInitModel<NganhDaoTao.IRecord>('nganhDaoTao', undefined, undefined, ipLocal);

	// Import headers configuration
	const importHeaders: TImportHeader[] = [
		{
			field: 'ma',
			label: 'Mã ngành đào tạo',
			type: 'String',
			required: true
		},
		{
			field: 'ten',
			label: 'Tên ngành đào tạo',
			type: 'String',
			required: true
		},
		{
			field: 'moTa',
			label: 'Mô tả ngành đào tạo',
			type: 'String',
			required: false
		},
		{
			field: 'toHopXetTuyenId',
			label: 'Tổ hợp xét tuyển',
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
			// Create Excel template with headers
			const templateData = [
				{
					'Mã ngành đào tạo': 'CNTT01',
					'Tên ngành đào tạo': 'Công nghệ thông tin',
					'Mô tả ngành đào tạo': 'Ngành đào tạo về phát triển phần mềm và hệ thống thông tin',
					'Tổ hợp xét tuyển': 'A00'
				},
				{
					'Mã ngành đào tạo': 'KTPM01',
					'Tên ngành đào tạo': 'Kỹ thuật phần mềm',
					'Mô tả ngành đào tạo': 'Ngành đào tạo về kỹ thuật phát triển phần mềm',
					'Tổ hợp xét tuyển': 'A01'
				}
			];

			const worksheet = XLSX.utils.json_to_sheet(templateData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

			// Create buffer and return blob
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
				if (!record.ma || record.ma.trim() === '') {
					errors.push('Mã ngành đào tạo không được để trống');
				}
				
				if (!record.ten || record.ten.trim() === '') {
					errors.push('Tên ngành đào tạo không được để trống');
				}

				if (!record.toHopXetTuyenId || record.toHopXetTuyenId.trim() === '') {
					errors.push('Tổ hợp xét tuyển không được để trống');
				}

				// Check for duplicates in current data
				const duplicateInData = data.findIndex((item, index) => 
					index !== i && 
					item.ma && 
					item.ma.trim().toLowerCase() === record.ma?.trim().toLowerCase()
				);
				
				if (duplicateInData !== -1) {
					errors.push(`Trùng mã ngành với dòng ${duplicateInData + 1} trong file`);
				}

				// Check for existing records in database
				try {
					const response = await fetch(`${ipLocal}/nganhDaoTao`);
					const existingRecords: NganhDaoTao.IRecord[] = await response.json();
					
					const existingRecord = existingRecords.find(existing => 
						existing.ma.trim().toLowerCase() === record.ma?.trim().toLowerCase()
					);
					
					if (existingRecord) {
						errors.push('Mã ngành đào tạo đã tồn tại trong hệ thống');
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
						ma: record.ma?.trim(),
						ten: record.ten?.trim(),
						moTa: record.moTa?.trim() || '',
						toHopXetTuyenId: record.toHopXetTuyenId?.trim()
					};

					// Call API to create record
					const response = await fetch(`${ipLocal}/nganhDaoTao`, {
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

	// Define exportable fields
	const getExportFieldsModel = async () => {
		return [
			{
				_id: 'id',
				label: 'ID ngành đào tạo',
				labels: ['ID ngành đào tạo'],
				selected: true
			},
			{
				_id: 'ma',
				label: 'Mã ngành đào tạo',
				labels: ['Mã ngành đào tạo'],
				selected: true
			},
			{
				_id: 'ten',
				label: 'Tên ngành đào tạo',
				labels: ['Tên ngành đào tạo'],
				selected: true
			},
			{
				_id: 'moTa',
				label: 'Mô tả ngành đào tạo',
				labels: ['Mô tả ngành đào tạo'],
				selected: true
			},
			{
				_id: 'toHopXetTuyenId',
				label: 'Tổ hợp xét tuyển',
				labels: ['Tổ hợp xét tuyển'],
				selected: true
			}
		];
	};

	// Format data before export
	const formatDataForExport = async (data: NganhDaoTao.IRecord[], fields: any[]) => {
		const formattedData = [];
		
		for (const record of data) {
			const row: any = {};
			
			for (const field of fields) {
				switch (field._id) {
					case 'id':
						row['ID ngành đào tạo'] = record.id || '';
						break;
					case 'ma':
						row['Mã ngành đào tạo'] = record.ma || '';
						break;
					case 'ten':
						row['Tên ngành đào tạo'] = record.ten || '';
						break;
					case 'moTa':
						row['Mô tả ngành đào tạo'] = record.moTa || '';
						break;
					case 'toHopXetTuyenId':
						row['Tổ hợp xét tuyển'] = record.toHopXetTuyenId || '';
						break;
				}
			}
			
			formattedData.push(row);
		}
		
		return formattedData;
	};

	// Export data
	const postExportModel = async (
		payload: any,
		condition?: any,
		filters?: any,
		otherQuery?: any
	) => {
		try {
			let dataToExport: NganhDaoTao.IRecord[] = [];
			
			// If there are selected IDs, fetch by IDs
			if (payload.ids && payload.ids.length > 0) {
				const promises = payload.ids.map((id: string) => 
					fetch(`${ipLocal}/nganhDaoTao/${id}`).then(res => res.json())
				);
				dataToExport = await Promise.all(promises);
			} else {
				// Fetch all data
				const response = await fetch(`${ipLocal}/nganhDaoTao`);
				dataToExport = await response.json();
				
				// Apply filters if present
				if (filters && Object.keys(filters).length > 0) {
					dataToExport = dataToExport.filter(record => {
						return Object.entries(filters).every(([key, value]) => {
							if (!value) return true;
							const recordValue = record[key as keyof NganhDaoTao.IRecord];
							if (typeof recordValue === 'string') {
								return recordValue.toLowerCase().includes(value.toString().toLowerCase());
							}
							return recordValue === value;
						});
					});
				}
			}
			
			// Format data according to selected fields
			const formattedData = await formatDataForExport(dataToExport, payload.definitions);
			
			// Create Excel workbook
			const worksheet = XLSX.utils.json_to_sheet(formattedData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Ngành đào tạo');
			
			// Create buffer and return blob
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