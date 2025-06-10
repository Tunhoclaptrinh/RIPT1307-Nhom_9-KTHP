import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { message } from 'antd';
import * as XLSX from 'xlsx';
import { ThongTinHocTap, TImportHeader, TImportResponse, TImportRowResponse } from '../services/ThongTinHocTap/typing';

export default () => {
	const objInt = useInitModel<ThongTinHocTap.IRecord>('thongTinHocTap', undefined, undefined, ipLocal);

	// Import headers configuration
	const importHeaders: TImportHeader[] = [
		{
			field: 'userId',
			label: 'ID thí sinh',
			type: 'String',
			required: true,
		},
		{
			field: 'thongTinTHPT_ten',
			label: 'Tên trường THPT',
			type: 'String',
			required: true,
		},
		{
			field: 'thongTinTHPT_tinh_ThanhPho',
			label: 'Tỉnh/Thành phố',
			type: 'String',
			required: true,
		},
		{
			field: 'thongTinTHPT_quanHuyen',
			label: 'Quận/Huyện',
			type: 'String',
		},
		{
			field: 'thongTinTHPT_xaPhuong',
			label: 'Xã/Phường',
			type: 'String',
		},
		{
			field: 'thongTinTHPT_diaChi',
			label: 'Địa chỉ trường',
			type: 'String',
		},
		{
			field: 'thongTinTHPT_maTruong',
			label: 'Mã trường THPT',
			type: 'String',
			required: true,
		},
		{
			field: 'thongTinTHPT_maTinh',
			label: 'Mã tỉnh',
			type: 'String',
			required: true,
		},
		{
			field: 'thongTinTHPT_doiTuongUT',
			label: 'Đối tượng ưu tiên',
			type: 'String',
		},
		{
			field: 'thongTinTHPT_khuVucUT',
			label: 'Khu vực ưu tiên',
			type: 'String',
		},
		{
			field: 'thongTinTHPT_daTotNghiep',
			label: 'Đã tốt nghiệp',
			type: 'Boolean',
			required: true,
		},
		{
			field: 'thongTinTHPT_namTotNghiep',
			label: 'Năm tốt nghiệp',
			type: 'Date',
			required: true,
		},
		{
			field: 'hocBaTHPT',
			label: 'ID học bạ THPT',
			type: 'String',
		},
		{
			field: 'diemTHPT_toan',
			label: 'Điểm THPT - Toán',
			type: 'Number',
		},
		{
			field: 'diemTHPT_van',
			label: 'Điểm THPT - Văn',
			type: 'Number',
		},
		{
			field: 'diemTHPT_anh',
			label: 'Điểm THPT - Anh',
			type: 'Number',
		},
		{
			field: 'diemDGTD_tongDiem',
			label: 'Điểm đánh giá tư duy - Tổng điểm',
			type: 'Number',
		},
		{
			field: 'diemDGNL_tongDiem',
			label: 'Điểm đánh giá năng lực - Tổng điểm',
			type: 'Number',
		},
		{
			field: 'giaiHSG_mon',
			label: 'Giải HSG - Môn',
			type: 'String',
		},
		{
			field: 'giaiHSG_loaiGiai',
			label: 'Giải HSG - Loại giải',
			type: 'String',
		},
		{
			field: 'giaiHSG_giaiHsgCap',
			label: 'Giải HSG - Cấp giải',
			type: 'String',
		},
		{
			field: 'giaiHSG_nam',
			label: 'Giải HSG - Năm',
			type: 'Date',
		},
		{
			field: 'chungChi_loaiCC',
			label: 'Chứng chỉ - Loại',
			type: 'String',
		},
		{
			field: 'chungChi_ketQua',
			label: 'Chứng chỉ - Kết quả',
			type: 'String',
		},
	];

	// Get import headers
	const getImportHeaderModel = async () => {
		return importHeaders;
	};

	// Get import template
	const getImportTemplateModel = async (): Promise<Blob> => {
		try {
			// Create template Excel with headers
			const templateData = [
				{
					'ID thí sinh': 'USER123',
					'Tên trường THPT': 'THPT Chuyên Hà Nội - Amsterdam',
					'Tỉnh/Thành phố': 'Hà Nội',
					'Quận/Huyện': 'Cầu Giấy',
					'Xã/Phường': 'Nghĩa Đô',
					'Địa chỉ trường': 'Số 1 Hoàng Minh Giám',
					'Mã trường THPT': 'HNA123',
					'Mã tỉnh': 'HN',
					'Đối tượng ưu tiên': 'hộ nghèo',
					'Khu vực ưu tiên': 'kv1',
					'Đã tốt nghiệp': true,
					'Năm tốt nghiệp': '2023',
					'ID học bạ THPT': 'HB123',
					'Điểm THPT - Toán': 8.5,
					'Điểm THPT - Văn': 7.5,
					'Điểm THPT - Anh': 9.0,
					'Điểm đánh giá tư duy - Tổng điểm': 85,
					'Điểm đánh giá năng lực - Tổng điểm': 90,
					'Giải HSG - Môn': 'toán',
					'Giải HSG - Loại giải': 'nhất',
					'Giải HSG - Cấp giải': 'quốc gia',
					'Giải HSG - Năm': '2022',
					'Chứng chỉ - Loại': 'tiếng anh',
					'Chứng chỉ - Kết quả': 'IELTS 7.5',
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
					errors.push('ID thí sinh không được để trống');
				} else {
					// Check if user exists
					try {
						const response = await fetch(`${ipLocal}/users/${record.userId}`);
						if (!response.ok) {
							errors.push('ID thí sinh không tồn tại trong hệ thống');
						}
					} catch (dbError) {
						console.error('User check error:', dbError);
						errors.push('Không thể kiểm tra ID thí sinh');
					}
				}

				if (!record.thongTinTHPT_ten || record.thongTinTHPT_ten.trim() === '') {
					errors.push('Tên trường THPT không được để trống');
				}

				if (!record.thongTinTHPT_tinh_ThanhPho || record.thongTinTHPT_tinh_ThanhPho.trim() === '') {
					errors.push('Tỉnh/Thành phố không được để trống');
				}

				if (!record.thongTinTHPT_maTruong || record.thongTinTHPT_maTruong.trim() === '') {
					errors.push('Mã trường THPT không được để trống');
				}

				if (!record.thongTinTHPT_maTinh || record.thongTinTHPT_maTinh.trim() === '') {
					errors.push('Mã tỉnh không được để trống');
				}

				if (record.thongTinTHPT_daTotNghiep === undefined || record.thongTinTHPT_daTotNghiep === '') {
					errors.push('Trạng thái tốt nghiệp không được để trống');
				}

				if (!record.thongTinTHPT_namTotNghiep || record.thongTinTHPT_namTotNghiep.trim() === '') {
					errors.push('Năm tốt nghiệp không được để trống');
				} else {
					const year = new Date(record.thongTinTHPT_namTotNghiep).getFullYear();
					if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
						errors.push('Năm tốt nghiệp không hợp lệ');
					}
				}

				// Validate khuVucUT
				if (record.thongTinTHPT_khuVucUT && !['kv1', 'kv2', 'kv2NT', 'kv3'].includes(record.thongTinTHPT_khuVucUT)) {
					errors.push('Khu vực ưu tiên không hợp lệ (phải là kv1, kv2, kv2NT, kv3)');
				}

				// Validate doiTuongUT
				if (record.thongTinTHPT_doiTuongUT && !['hộ nghèo', 'cận nghèo'].includes(record.thongTinTHPT_doiTuongUT)) {
					errors.push('Đối tượng ưu tiên không hợp lệ (phải là hộ nghèo, cận nghèo hoặc chuỗi khác)');
				}

				// Validate hocBaTHPT if provided
				if (record.hocBaTHPT) {
					try {
						const response = await fetch(`${ipLocal}/hocBa/${record.hocBaTHPT}`);
						if (!response.ok) {
							errors.push('ID học bạ không tồn tại trong hệ thống');
						}
					} catch (dbError) {
						console.error('HocBa check error:', dbError);
						errors.push('Không thể kiểm tra ID học bạ');
					}
				}

				// Validate diemTHPT
				const diemTHPTFields = ['toan', 'van', 'anh'];
				for (const mon of diemTHPTFields) {
					if (record[`diemTHPT_${mon}`] !== undefined && record[`diemTHPT_${mon}`] !== '') {
						const diem = Number(record[`diemTHPT_${mon}`]);
						if (isNaN(diem) || diem < 0 || diem > 10) {
							errors.push(`Điểm THPT - ${mon} không hợp lệ (phải từ 0 đến 10)`);
						}
					}
				}

				// Validate diemDGTD and diemDGNL
				if (record.diemDGTD_tongDiem !== undefined && record.diemDGTD_tongDiem !== '') {
					const diem = Number(record.diemDGTD_tongDiem);
					if (isNaN(diem) || diem < 0) {
						errors.push('Điểm đánh giá tư duy - Tổng điểm không hợp lệ');
					}
				}

				if (record.diemDGNL_tongDiem !== undefined && record.diemDGNL_tongDiem !== '') {
					const diem = Number(record.diemDGNL_tongDiem);
					if (isNaN(diem) || diem < 0) {
						errors.push('Điểm đánh giá năng lực - Tổng điểm không hợp lệ');
					}
				}

				// Validate giaiHSG
				if (record.giaiHSG_mon || record.giaiHSG_loaiGiai || record.giaiHSG_giaiHsgCap || record.giaiHSG_nam) {
					if (!record.giaiHSG_mon) errors.push('Giải HSG - Môn không được để trống nếu có thông tin giải');
					if (!record.giaiHSG_loaiGiai || !['nhất', 'nhì', 'ba', 'khuyến khích'].includes(record.giaiHSG_loaiGiai)) {
						errors.push('Giải HSG - Loại giải không hợp lệ');
					}
					if (!record.giaiHSG_giaiHsgCap || !['thành phố', 'tỉnh', 'quốc gia', 'quốc tế'].includes(record.giaiHSG_giaiHsgCap)) {
						errors.push('Giải HSG - Cấp giải không hợp lệ');
					}
					if (!record.giaiHSG_nam || isNaN(new Date(record.giaiHSG_nam).getTime())) {
						errors.push('Giải HSG - Năm không hợp lệ');
					}
				}

				// Validate chungChi
				if (record.chungChi_loaiCC || record.chungChi_ketQua) {
					if (!record.chungChi_loaiCC) errors.push('Chứng chỉ - Loại không được để trống nếu có thông tin chứng chỉ');
					if (!record.chungChi_ketQua) errors.push('Chứng chỉ - Kết quả không được để trống nếu có thông tin chứng chỉ');
				}

				// Check for duplicates in current data
				const duplicateInData = data.findIndex(
					(item, index) =>
						index !== i &&
						item.userId &&
						item.userId.trim().toLowerCase() === record.userId?.trim().toLowerCase(),
				);
				if (duplicateInData !== -1) {
					errors.push(`Trùng ID thí sinh với dòng ${duplicateInData + 1} trong file`);
				}

				// Check for existing records in database
				try {
					const response = await fetch(`${ipLocal}/thongTinHocTap?userId=${record.userId}`);
					const existingRecords: ThongTinHocTap.IRecord[] = await response.json();
					if (existingRecords.length > 0) {
						errors.push('ID thí sinh đã có thông tin học tập trong hệ thống');
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
					const payload: ThongTinHocTap.IRecord = {
						id: '', // Will be generated by backend
						userId: record.userId.trim(),
						thongTinTHPT: {
							ten: record.thongTinTHPT_ten?.trim() || '',
							tinh_ThanhPho: record.thongTinTHPT_tinh_ThanhPho?.trim() || '',
							quanHuyen: record.thongTinTHPT_quanHuyen?.trim() || '',
							xaPhuong: record.thongTinTHPT_xaPhuong?.trim() || '',
							diaChi: record.thongTinTHPT_diaChi?.trim() || '',
							maTruong: record.thongTinTHPT_maTruong?.trim() || '',
							maTinh: record.thongTinTHPT_maTinh?.trim() || '',
							doiTuongUT: record.thongTinTHPT_doiTuongUT?.trim() || '',
							khuVucUT: record.thongTinTHPT_khuVucUT?.trim() || '',
							daTotNghiep: Boolean(record.thongTinTHPT_daTotNghiep),
							namTotNghiep: record.thongTinTHPT_namTotNghiep
								? new Date(record.thongTinTHPT_namTotNghiep).toISOString()
								: '',
						},
						hocBaTHPT: record.hocBaTHPT?.trim() || '',
						diemTHPT: [],
						diemDGTD: {
							mon: [],
							minhChung: '',
							tongDiem: Number(record.diemDGTD_tongDiem) || 0,
						},
						diemDGNL: {
							mon: [],
							minhChung: '',
							tongDiem: Number(record.diemDGNL_tongDiem) || 0,
						},
						giaiHSG: undefined,
						chungChi: [],
					};

					// Add diemTHPT
					const diemTHPTFields = ['toan', 'van', 'anh'];
					for (const mon of diemTHPTFields) {
						if (record[`diemTHPT_${mon}`] !== undefined && record[`diemTHPT_${mon}`] !== '') {
							payload.diemTHPT.push({
								mon: mon as ThongTinHocTap.MonThi,
								diem: Number(record[`diemTHPT_${mon}`]),
							});
						}
					}

					// Add giaiHSG if provided
					if (record.giaiHSG_mon && record.giaiHSG_loaiGiai && record.giaiHSG_giaiHsgCap && record.giaiHSG_nam) {
						payload.giaiHSG = {
							giaiHsgCap: record.giaiHSG_giaiHsgCap as ThongTinHocTap.GiaiCap,
							mon: record.giaiHSG_mon as ThongTinHocTap.MonThi,
							loaiGiai: record.giaiHSG_loaiGiai as ThongTinHocTap.LoaiGiai,
							nam: new Date(record.giaiHSG_nam).toISOString(),
							noiCap: '',
							minhChung: '',
						};
					}

					// Add chungChi if provided
					if (record.chungChi_loaiCC && record.chungChi_ketQua) {
						payload.chungChi.push({
							loaiCC: record.chungChi_loaiCC as ThongTinHocTap.LoaiCC,
							ketQua: record.chungChi_ketQua.toString(),
							minhChung: '',
						});
					}

					// Call API to create record
					const response = await fetch(`${ipLocal}/thongTinHocTap`, {
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

	// Định nghĩa các trường có thể export (already provided in original file, included here for completeness)
	const getExportFieldsModel = async () => {
		return [
			{
				_id: 'userId',
				label: 'Thông tin thí sinh',
				labels: ['Thông tin thí sinh'],
				children: [
					{
						_id: 'userId',
						label: 'ID thí sinh',
						labels: ['Thông tin thí sinh', 'ID thí sinh'],
						selected: true,
					},
					{
						_id: 'userFullName',
						label: 'Họ và tên',
						labels: ['Thông tin thí sinh', 'Họ và tên'],
						selected: true,
					},
				],
			},
			{
				_id: 'thongTinTHPT',
				label: 'Thông tin THPT',
				labels: ['Thông tin THPT'],
				children: [
					{
						_id: 'thongTinTHPT_ten',
						label: 'Tên trường',
						labels: ['Thông tin THPT', 'Tên trường'],
						selected: true,
					},
					{
						_id: 'thongTinTHPT_maTruong',
						label: 'Mã trường',
						labels: ['Thông tin THPT', 'Mã trường'],
						selected: true,
					},
					{
						_id: 'thongTinTHPT_tinh_ThanhPho',
						label: 'Tỉnh/Thành phố',
						labels: ['Thông tin THPT', 'Tỉnh/Thành phố'],
						selected: true,
					},
				],
			},
			{
				_id: 'daTotNghiep',
				label: 'Trạng thái tốt nghiệp',
				labels: ['Trạng thái tốt nghiệp'],
				selected: true,
			},
			{
				_id: 'namTotNghiep',
				label: 'Năm tốt nghiệp',
				labels: ['Năm tốt nghiệp'],
				selected: true,
			},
			{
				_id: 'khuVucUT',
				label: 'Khu vực ưu tiên',
				labels: ['Khu vực ưu tiên'],
				selected: true,
			},
			{
				_id: 'doiTuongUT',
				label: 'Đối tượng ưu tiên',
				labels: ['Đối tượng ưu tiên'],
				selected: true,
			},
			{
				_id: 'diemTHPT',
				label: 'Điểm THPT',
				labels: ['Điểm THPT'],
				children: [
					{
						_id: 'diemTHPT_summary',
						label: 'Tóm tắt điểm',
						labels: ['Điểm THPT', 'Tóm tắt điểm'],
						selected: true,
					},
					{
						_id: 'diemTHPT_detail',
						label: 'Chi tiết từng môn',
						labels: ['Điểm THPT', 'Chi tiết từng môn'],
						selected: false,
					},
				],
			},
			{
				_id: 'diemDGTD',
				label: 'Điểm đánh giá tư duy',
				labels: ['Điểm đánh giá tư duy'],
				selected: true,
			},
			{
				_id: 'diemDGNL',
				label: 'Điểm đánh giá năng lực',
				labels: ['Điểm đánh giá năng lực'],
				selected: true,
			},
			{
				_id: 'giaiHSG',
				label: 'Giải học sinh giỏi',
				labels: ['Giải học sinh giỏi'],
				selected: true,
			},
			{
				_id: 'chungChi',
				label: 'Chứng chỉ',
				labels: ['Chứng chỉ'],
				selected: true,
			},
			{
				_id: 'hocBaTHPT',
				label: 'Học bạ THPT',
				labels: ['Học bạ THPT'],
				selected: false,
			},
		];
	};

	// Hàm lấy thông tin user từ API users
	const getUserInfo = async (userId: string) => {
		try {
			const response = await fetch(`${ipLocal}/users/${userId}`);
			if (response.ok) {
				return await response.json();
			}
			return null;
		} catch (error) {
			console.error('Error fetching user info:', error);
			return null;
		}
	};

	// Hàm format dữ liệu trước khi export
	const formatDataForExport = async (data: ThongTinHocTap.IRecord[], fields: any[]) => {
		const formattedData = [];

		for (const record of data) {
			const row: any = {};

			// Lấy thông tin user nếu cần
			let userInfo = null;
			if (fields.some((f: any) => f._id.includes('user'))) {
				userInfo = await getUserInfo(record.userId);
			}

			for (const field of fields) {
				switch (field._id) {
					case 'userId':
						row['ID thí sinh'] = record.userId;
						break;
					case 'userFullName':
						row['Họ và tên'] = userInfo
							? `${userInfo.ho || ''} ${userInfo.ten || ''}`.trim()
							: 'N/A';
						break;
					case 'thongTinTHPT_ten':
						row['Tên trường'] = record.thongTinTHPT?.ten || '';
						break;
					case 'thongTinTHPT_maTruong':
						row['Mã trường'] = record.thongTinTHPT?.maTruong || '';
						break;
					case 'thongTinTHPT_tinh_ThanhPho':
						row['Tỉnh/Thành phố'] = record.thongTinTHPT?.tinh_ThanhPho || '';
						break;
					case 'daTotNghiep':
						row['Trạng thái tốt nghiệp'] = record.thongTinTHPT?.daTotNghiep
							? 'Đã tốt nghiệp'
							: 'Chưa tốt nghiệp';
						break;
					case 'namTotNghiep':
						row['Năm tốt nghiệp'] = record.thongTinTHPT?.namTotNghiep
							? new Date(record.thongTinTHPT.namTotNghiep).getFullYear().toString()
							: '';
						break;
					case 'khuVucUT':
						row['Khu vực ưu tiên'] = record.thongTinTHPT?.khuVucUT || '';
						break;
					case 'doiTuongUT':
						row['Đối tượng ưu tiên'] = record.thongTinTHPT?.doiTuongUT || '';
						break;
					case 'diemTHPT_summary':
						if (record.diemTHPT && record.diemTHPT.length > 0) {
							row['Điểm THPT'] = record.diemTHPT
								.map((d) => `${d.mon}: ${d.diem}`)
								.join('; ');
						} else {
							row['Điểm THPT'] = 'Chưa có điểm';
						}
						break;
					case 'diemTHPT_detail':
						if (record.diemTHPT && record.diemTHPT.length > 0) {
							record.diemTHPT.forEach((diem, index) => {
								row[`Môn ${index + 1} - Tên`] = diem.mon;
								row[`Môn ${index + 1} - Điểm`] = diem.diem;
							});
						}
						break;
					case 'diemDGTD':
						row['Điểm đánh giá tư duy'] = record.diemDGTD?.tongDiem || 0;
						if (record.diemDGTD?.mon && record.diemDGTD.mon.length > 0) {
							record.diemDGTD.mon.forEach((mon, index) => {
								row[`ĐGTD - Môn ${index + 1} - Tên`] = mon.ten;
								row[`ĐGTD - Môn ${index + 1} - Điểm`] = mon.diem;
							});
						}
						break;
					case 'diemDGNL':
						row['Điểm đánh giá năng lực'] = record.diemDGNL?.tongDiem || 0;
						if (record.diemDGNL?.mon && record.diemDGNL.mon.length > 0) {
							record.diemDGNL.mon.forEach((mon, index) => {
								row[`ĐGNL - Môn ${index + 1} - Tên`] = mon.ten;
								row[`ĐGNL - Môn ${index + 1} - Điểm`] = mon.diem;
							});
						}
						break;
					case 'giaiHSG':
						row['Giải HSG'] = record.giaiHSG
							? `${record.giaiHSG.mon} - ${record.giaiHSG.loaiGiai} (${record.giaiHSG.giaiHsgCap})`
							: 'Không có';
						break;
					case 'chungChi':
						row['Chứng chỉ'] = record.chungChi && record.chungChi.length > 0
							? record.chungChi.map((cc) => `${cc.loaiCC}: ${cc.ketQua}`).join('; ')
							: 'Không có';
						break;
					case 'hocBaTHPT':
						row['Học bạ THPT'] = record.hocBaTHPT || '';
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
		otherQuery?: any,
	) => {
		try {
			let dataToExport: ThongTinHocTap.IRecord[] = [];

			// Nếu có selectedIds, lấy theo IDs đã chọn
			if (payload.ids && payload.ids.length > 0) {
				const promises = payload.ids.map((id: string) =>
					fetch(`${ipLocal}/thongTinHocTap/${id}`).then((res) => res.json()),
				);
				dataToExport = await Promise.all(promises);
			} else {
				// Lấy toàn bộ dữ liệu
				const response = await fetch(`${ipLocal}/thongTinHocTap`);
				dataToExport = await response.json();

				// Áp dụng filters nếu có
				if (filters && Object.keys(filters).length > 0) {
					dataToExport = dataToExport.filter((record) => {
						return Object.entries(filters).every(([key, value]) => {
							if (!value) return true;
							const recordValue = key.includes('thongTinTHPT')
								? record.thongTinTHPT[key.split('.')[1] as keyof ThongTinHocTap.IThongTinTHPT]
								: record[key as keyof ThongTinHocTap.IRecord];
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
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Thông tin học tập');

			// Tạo buffer và return blob
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