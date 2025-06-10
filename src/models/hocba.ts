import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { message } from 'antd';
import * as XLSX from 'xlsx';
import { DiemHocSinh, TImportHeader, TImportResponse, TImportRowResponse } from '../services/HocBa/typing';

export default () => {
	const objInt = useInitModel<DiemHocSinh.IRecord>('hocBa', undefined, undefined, ipLocal);

	// Import headers configuration
	const importHeaders: TImportHeader[] = [
		{
			field: 'userId',
			label: 'ID Thí sinh',
			type: 'String',
			required: true,
		},
		{
			field: 'khoiLop',
			label: 'Khối lớp',
			type: 'String',
			required: true,
		},
		// {
		// 	field: 'thongTinHocTapId',
		// 	label: 'ID Thông tin học tập',
		// 	type: 'String',
		// 	required: true
		// },
		{
			field: 'diemMonHoc',
			label: 'Điểm môn học (JSON)',
			type: 'String',
			required: true,
		},
		{
			field: 'loaiHanhKiem',
			label: 'Loại hạnh kiểm',
			type: 'String',
			required: true,
		},
		{
			field: 'minhChung',
			label: 'Minh chứng',
			type: 'String',
			required: false,
		},
		{
			field: 'nhanXetGiaoVien',
			label: 'Nhận xét giáo viên',
			type: 'String',
			required: false,
		},
		{
			field: 'xepLoaiHocLuc',
			label: 'Xếp loại học lực',
			type: 'String',
			required: true,
		},
		{
			field: 'namHoc',
			label: 'Năm học',
			type: 'String',
			required: true,
		},
	];

	// Get import headers
	const getImportHeaderModel = async () => {
		return importHeaders;
	};

	// Get import template
	const getImportTemplateModel = async (): Promise<Blob> => {
		try {
			// Create template Excel with sample data
			const templateData = [
				{
					'ID Thí sinh': 'user123',
					'Khối lớp': '12A1',
					'ID Thông tin học tập': 'tt123',
					'Điểm môn học (JSON)': JSON.stringify([
						{ mon: 'Toán', hocKy: '1', diemTongKet: 8.5, ghiChu: '' },
						{ mon: 'Văn', hocKy: '1', diemTongKet: 7.8, ghiChu: '' },
					]),
					'Loại hạnh kiểm': 'tốt',
					'Minh chứng': '/files/minhchung.pdf',
					'Nhận xét giáo viên': 'Học sinh chăm chỉ',
					'Xếp loại học lực': 'Giỏi',
					'Năm học': '2023-2024',
				},
			];

			const worksheet = XLSX.utils.json_to_sheet(templateData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

			// Create buffer and return blob
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([excelBuffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
				if (!record.userId || record.userId.trim() === '') {
					errors.push('ID Thí sinh không được để trống');
				} else {
					// Check if userId exists
					try {
						const response = await fetch(`${ipLocal}/users/${record.userId}`);
						if (!response.ok) {
							errors.push('ID Thí sinh không tồn tại trong hệ thống');
						}
					} catch (dbError) {
						console.error('User check error:', dbError);
						errors.push('Không thể kiểm tra ID Thí sinh');
					}
				}

				if (!record.khoiLop || record.khoiLop.trim() === '') {
					errors.push('Khối lớp không được để trống');
				}

				// if (!record.thongTinHocTapId || record.thongTinHocTapId.trim() === '') {
				// 	errors.push('ID Thông tin học tập không được để trống');
				// } else {
				// 	// Check if thongTinHocTapId exists
				// 	try {
				// 		const response = await fetch(`${ipLocal}/thongTinHocTap/${record.thongTinHocTapId}`);
				// 		if (!response.ok) {
				// 			errors.push('ID Thông tin học tập không tồn tại trong hệ thống');
				// 		}
				// 	} catch (dbError) {
				// 		console.error('ThongTinHocTap check error:', dbError);
				// 		errors.push('Không thể kiểm tra ID Thông tin học tập');
				// 	}
				// }

				if (!record.diemMonHoc || record.diemMonHoc.trim() === '') {
					errors.push('Điểm môn học không được để trống');
				} else {
					try {
						const diemMonHoc = JSON.parse(record.diemMonHoc);
						if (!Array.isArray(diemMonHoc)) {
							errors.push('Điểm môn học phải là mảng JSON hợp lệ');
						} else {
							diemMonHoc.forEach((diem: DiemHocSinh.IDiemMonHoc, index: number) => {
								if (!diem.mon || diem.mon.trim() === '') {
									errors.push(`Môn học tại mục ${index + 1} không được để trống`);
								}
								if (!diem.hocKy || diem.hocKy.trim() === '') {
									errors.push(`Học kỳ tại mục ${index + 1} không được để trống`);
								}
								if (typeof diem.diemTongKet !== 'number' || diem.diemTongKet < 0 || diem.diemTongKet > 10) {
									errors.push(`Điểm tổng kết tại mục ${index + 1} phải là số từ 0 đến 10`);
								}
							});
						}
					} catch (jsonError) {
						errors.push('Điểm môn học không phải là JSON hợp lệ');
					}
				}

				if (
					!record.loaiHanhKiem ||
					!['tốt', 'khá', 'trung bình', 'yếu', 'kém'].includes(record.loaiHanhKiem.toLowerCase())
				) {
					errors.push('Loại hạnh kiểm phải là một trong: tốt, khá, trung bình, yếu, kém');
				}

				if (!record.xepLoaiHocLuc || record.xepLoaiHocLuc.trim() === '') {
					errors.push('Xếp loại học lực không được để trống');
				}

				if (!record.namHoc || record.namHoc.trim() === '') {
					errors.push('Năm học không được để trống');
				}

				// Check for duplicates in current data
				const duplicateInData = data.findIndex(
					(item, index) =>
						index !== i &&
						item.userId &&
						item.namHoc &&
						item.userId.trim() === record.userId?.trim() &&
						item.namHoc.trim() === record.namHoc?.trim(),
				);

				if (duplicateInData !== -1) {
					errors.push(`Trùng ID Thí sinh và Năm học với dòng ${duplicateInData + 1} trong file`);
				}

				// Check for existing records in database
				try {
					const response = await fetch(`${ipLocal}/hocBa`);
					const existingRecords: DiemHocSinh.IRecord[] = await response.json();

					const existingRecord = existingRecords.find(
						(existing) => existing.userId === record.userId?.trim() && existing.namHoc === record.namHoc?.trim(),
					);

					if (existingRecord) {
						errors.push('Học bạ đã tồn tại cho thí sinh này trong năm học này');
					}
				} catch (dbError) {
					console.error('Database check error:', dbError);
					errors.push('Không thể kiểm tra dữ liệu trong hệ thống');
				}

				validateResults.push({
					index: i,
					rowErrors: errors.length > 0 ? errors : undefined,
				});
			}

			return {
				validate: validateResults,
				error: false,
			};
		} catch (error) {
			console.error('Validation error:', error);
			return {
				validate: [],
				error: true,
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
						userId: record.userId?.trim(),
						khoiLop: record.khoiLop?.trim(),
						// thongTinHocTapId: record.thongTinHocTapId?.trim(),
						diemMonHoc: JSON.parse(record.diemMonHoc),
						loaiHanhKiem: record.loaiHanhKiem?.toLowerCase(),
						minhChung: record.minhChung?.trim() || '',
						nhanXetGiaoVien: record.nhanXetGiaoVien?.trim() || '',
						xepLoaiHocLuc: record.xepLoaiHocLuc?.trim(),
						namHoc: record.namHoc?.trim(),
					};

					// Call API to create record
					const response = await fetch(`${ipLocal}/hocBa`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(payload),
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
					rowErrors: errors.length > 0 ? errors : undefined,
				});
			}

			message.success(`Đã nhập thành công ${successCount}/${data.length} bản ghi!`);

			return {
				validate: executeResults,
				error: false,
			};
		} catch (error) {
			console.error('Execute import error:', error);
			message.error('Có lỗi xảy ra khi thực hiện import!');
			return {
				validate: [],
				error: true,
			};
		}
	};

	// Define exportable fields
	const getExportFieldsModel = async () => {
		return [
			{
				_id: 'id',
				label: 'ID Học bạ',
				labels: ['ID Học bạ'],
				selected: true,
			},
			{
				_id: 'userId',
				label: 'ID Thí sinh',
				labels: ['ID Thí sinh'],
				selected: true,
			},
			{
				_id: 'khoiLop',
				label: 'Khối lớp',
				labels: ['Khối lớp'],
				selected: true,
			},
			// {
			// 	_id: 'thongTinHocTapId',
			// 	label: 'ID Thông tin học tập',
			// 	labels: ['ID Thông tin học tập'],
			// 	selected: true,
			// },
			{
				_id: 'diemMonHoc',
				label: 'Điểm môn học',
				labels: ['Điểm môn học'],
				selected: true,
			},
			{
				_id: 'loaiHanhKiem',
				label: 'Loại hạnh kiểm',
				labels: ['Loại hạnh kiểm'],
				selected: true,
			},
			{
				_id: 'minhChung',
				label: 'Minh chứng',
				labels: ['Minh chứng'],
				selected: true,
			},
			{
				_id: 'nhanXetGiaoVien',
				label: 'Nhận xét giáo viên',
				labels: ['Nhận xét giáo viên'],
				selected: true,
			},
			{
				_id: 'xepLoaiHocLuc',
				label: 'Xếp loại học lực',
				labels: ['Xếp loại học lực'],
				selected: true,
			},
			{
				_id: 'namHoc',
				label: 'Năm học',
				labels: ['Năm học'],
				selected: true,
			},
		];
	};

	// Format data for export
	const formatDataForExport = async (data: DiemHocSinh.IRecord[], fields: any[]) => {
		const formattedData = [];

		for (const record of data) {
			const row: any = {};

			for (const field of fields) {
				switch (field._id) {
					case 'id':
						row['ID Học bạ'] = record.id || '';
						break;
					case 'userId':
						row['ID Thí sinh'] = record.userId || '';
						break;
					case 'khoiLop':
						row['Khối lớp'] = record.khoiLop || '';
						break;
					// case 'thongTinHocTapId':
					// 	row['ID Thông tin học tập'] = record.thongTinHocTapId || '';
					// 	break;
					case 'diemMonHoc':
						row['Điểm môn học'] = JSON.stringify(record.diemMonHoc) || '';
						break;
					case 'loaiHanhKiem':
						row['Loại hạnh kiểm'] = record.loaiHanhKiem || '';
						break;
					case 'minhChung':
						row['Minh chứng'] = record.minhChung || '';
						break;
					case 'nhanXetGiaoVien':
						row['Nhận xét giáo viên'] = record.nhanXetGiaoVien || '';
						break;
					case 'xepLoaiHocLuc':
						row['Xếp loại học lực'] = record.xepLoaiHocLuc || '';
						break;
					case 'namHoc':
						row['Năm học'] = record.namHoc || '';
						break;
				}
			}

			formattedData.push(row);
		}

		return formattedData;
	};

	// Export data
	const postExportModel = async (payload: any, condition?: any, filters?: any, otherQuery?: any) => {
		try {
			let dataToExport: DiemHocSinh.IRecord[] = [];

			// If there are selected IDs, fetch by IDs
			if (payload.ids && payload.ids.length > 0) {
				const promises = payload.ids.map((id: string) => fetch(`${ipLocal}/hocBa/${id}`).then((res) => res.json()));
				dataToExport = await Promise.all(promises);
			} else {
				// Fetch all data
				const response = await fetch(`${ipLocal}/hocBa`);
				dataToExport = await response.json();

				// Apply filters if any
				if (filters && Object.keys(filters).length > 0) {
					dataToExport = dataToExport.filter((record) => {
						return Object.entries(filters).every(([key, value]) => {
							if (!value) return true;
							const recordValue = record[key as keyof DiemHocSinh.IRecord];
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

			// Create workbook Excel
			const worksheet = XLSX.utils.json_to_sheet(formattedData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Học bạ');

			// Create buffer and return blob
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			const blob = new Blob([excelBuffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
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
