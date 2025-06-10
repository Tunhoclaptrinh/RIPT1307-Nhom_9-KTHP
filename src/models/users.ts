import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { dangKy } from '../services/Users/index';
import { message } from 'antd';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { useAddress } from '@/hooks/useAddress';
import { TImportHeader, TImportResponse, TImportRowResponse, User } from '../services/Users/typing';

export default () => {
	const objInt = useInitModel<User.IRecord>('users', undefined, undefined, ipLocal);
	const { getAddressName } = useAddress();

	// Import headers configuration
	const importHeaders: TImportHeader[] = [
		{
			field: 'ho',
			label: 'Họ',
			type: 'String',
			required: true
		},
		{
			field: 'ten',
			label: 'Tên',
			type: 'String',
			required: true
		},
		{
			field: 'username',
			label: 'Username',
			type: 'String',
			required: false
		},
		{
			field: 'email',
			label: 'Email',
			type: 'String',
			required: true
		},
		{
			field: 'password',
			label: 'Mật khẩu',
			type: 'String',
			required: true
		},
		{
			field: 'soCCCD',
			label: 'Số CCCD',
			type: 'String',
			required: true
		},
		{
			field: 'soDT',
			label: 'Số điện thoại',
			type: 'String',
			required: true
		},
		{
			field: 'ngaySinh',
			label: 'Ngày sinh',
			type: 'Date',
			required: true
		},
		{
			field: 'gioiTinh',
			label: 'Giới tính',
			type: 'String',
			required: true
		},
		{
			field: 'ngayCap',
			label: 'Ngày cấp CCCD',
			type: 'Date',
			required: false
		},
		{
			field: 'noiCap',
			label: 'Nơi cấp CCCD',
			type: 'String',
			required: false
		},
		{
			field: 'role',
			label: 'Vai trò',
			type: 'String',
			required: false
		}
	];

	// Get import headers
	const getImportHeaderModel = async () => {
		return importHeaders;
	};

	// Get import template
	const getImportTemplateModel = async (): Promise<Blob> => {
		try {
			// Tạo template Excel với headers và dữ liệu mẫu
			const templateData = [
				{
					'Họ': 'Nguyễn',
					'Tên': 'Văn A',
					'Username': 'nguyenvana',
					'Email': 'nguyenvana@email.com',
					'Mật khẩu': '123456',
					'Số CCCD': '001199000001',
					'Số điện thoại': '0901234567',
					'Ngày sinh': '01-01-2000',
					'Giới tính': 'nam',
					'Ngày cấp CCCD': '01-01-2018',
					'Nơi cấp CCCD': 'Cục cảnh sát ĐKQL cư trú và DLQG về dân cư',
					'Vai trò': 'user'
				},
				{
					'Họ': 'Trần',
					'Tên': 'Thị B',
					'Username': 'tranthib',
					'Email': 'tranthib@email.com',
					'Mật khẩu': '123456',
					'Số CCCD': '001199000002',
					'Số điện thoại': '0901234568',
					'Ngày sinh': '15/06/1999',
					'Giới tính': 'nữ',
					'Ngày cấp CCCD': '15/06/2017',
					'Nơi cấp CCCD': 'Cục cảnh sát ĐKQL cư trú và DLQG về dân cư',
					'Vai trò': 'user'
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

	// Validate date format (only DD/MM/YYYY)
	const isValidDate = (dateString: string): boolean => {
		return moment(dateString, 'DD/MM/YYYY', true).isValid();
	};

	// Parse date to ISO format
	const parseDate = (dateString: string): string | null => {
		const parsed = moment(dateString, 'DD/MM/YYYY', true);
		return parsed.isValid() ? parsed.toISOString() : null;
	};

	// Validate email format
	const isValidEmail = (email: string): boolean => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Validate phone number (Vietnamese format)
	const isValidPhoneNumber = (phone: string): boolean => {
		const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
		return phoneRegex.test(phone);
	};

	// Validate CCCD format
	const isValidCCCD = (cccd: string): boolean => {
		const cccdRegex = /^[0-9]{12}$/;
		return cccdRegex.test(cccd);
	};

	// Validate import data
	const postValidateModel = async (data: any[]): Promise<TImportResponse> => {
		try {
			const validateResults: TImportRowResponse[] = [];
			
			for (let i = 0; i < data.length; i++) {
				const record = data[i];
				const errors: string[] = [];
				
				// Validate required fields
				if (!record.ho || record.ho.trim() === '') {
					errors.push('Họ không được để trống');
				}
				
				if (!record.ten || record.ten.trim() === '') {
					errors.push('Tên không được để trống');
				}

				if (!record.email || record.email.trim() === '') {
					errors.push('Email không được để trống');
				} else if (!isValidEmail(record.email.trim())) {
					errors.push('Email không đúng định dạng');
				}

				if (!record.password || record.password.trim() === '') {
					errors.push('Mật khẩu không được để trống');
				}

				if (!record.soCCCD || record.soCCCD.trim() === '') {
					errors.push('Số CCCD không được để trống');
				} else if (!isValidCCCD(record.soCCCD.trim())) {
					errors.push('Số CCCD phải có 12 chữ số');
				}

				if (!record.soDT || record.soDT.trim() === '') {
					errors.push('Số điện thoại không được để trống');
				} else if (!isValidPhoneNumber(record.soDT.trim())) {
					errors.push('Số điện thoại không đúng định dạng Việt Nam');
				}

				if (!record.ngaySinh || record.ngaySinh.trim() === '') {
					errors.push('Ngày sinh không được để trống');
				} else if (!isValidDate(record.ngaySinh.trim())) {
					errors.push('Ngày sinh phải có định dạng DD/MM/YYYY');
				}

				if (!record.gioiTinh || record.gioiTinh.trim() === '') {
					errors.push('Giới tính không được để trống');
				} else if (!['nam', 'nữ', 'khác'].includes(record.gioiTinh.trim().toLowerCase())) {
					errors.push('Giới tính phải là: nam, nữ hoặc khác');
				}

				// Validate optional date fields
				if (record.ngayCap && record.ngayCap.trim() !== '' && !isValidDate(record.ngayCap.trim())) {
					errors.push('Ngày cấp CCCD phải có định dạng DD/MM/YYYY');
				}

				// Validate role
				if (record.role && record.role.trim() !== '' && !['user', 'admin'].includes(record.role.trim().toLowerCase())) {
					errors.push('Vai trò phải là: user hoặc admin');
				}

				// Check for duplicates in current data
				const duplicateEmail = data.findIndex((item, index) => 
					index !== i && 
					item.email && 
					item.email.trim().toLowerCase() === record.email?.trim().toLowerCase()
				);
				
				if (duplicateEmail !== -1) {
					errors.push(`Email trùng với dòng ${duplicateEmail + 1} trong file`);
				}

				const duplicateCCCD = data.findIndex((item, index) => 
					index !== i && 
					item.soCCCD && 
					item.soCCCD.trim() === record.soCCCD?.trim()
				);
				
				if (duplicateCCCD !== -1) {
					errors.push(`Số CCCD trùng với dòng ${duplicateCCCD + 1} trong file`);
				}

				const duplicatePhone = data.findIndex((item, index) => 
					index !== i && 
					item.soDT && 
					item.soDT.trim() === record.soDT?.trim()
				);
				
				if (duplicatePhone !== -1) {
					errors.push(`Số điện thoại trùng với dòng ${duplicatePhone + 1} trong file`);
				}

				// Check for existing records in database
				try {
					const response = await fetch(`${ipLocal}/users`);
					const existingRecords: User.IRecord[] = await response.json();
					
					// Check email exists
					const existingEmail = existingRecords.find(existing => 
						existing.email && existing.email.toLowerCase() === record.email?.trim().toLowerCase()
					);
					if (existingEmail) {
						errors.push('Email đã tồn tại trong hệ thống');
					}

					// Check CCCD exists
					const existingCCCD = existingRecords.find(existing => 
						existing.soCCCD && existing.soCCCD === record.soCCCD?.trim()
					);
					if (existingCCCD) {
						errors.push('Số CCCD đã tồn tại trong hệ thống');
					}

					// Check phone exists
					const existingPhone = existingRecords.find(existing => 
						existing.soDT && existing.soDT === record.soDT?.trim()
					);
					if (existingPhone) {
						errors.push('Số điện thoại đã tồn tại trong hệ thống');
					}

					// Check username exists (if provided)
					if (record.username && record.username.trim() !== '') {
						const existingUsername = existingRecords.find(existing => 
							existing.username && existing.username.toLowerCase() === record.username?.trim().toLowerCase()
						);
						if (existingUsername) {
							errors.push('Username đã tồn tại trong hệ thống');
						}
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
					const payload: Partial<User.IRecord> = {
						ho: record.ho?.trim(),
						ten: record.ten?.trim(),
						username: record.username?.trim() || undefined,
						email: record.email?.trim(),
						password: record.password?.trim(),
						soCCCD: record.soCCCD?.trim(),
						soDT: record.soDT?.trim(),
						ngaySinh: parseDate(record.ngaySinh?.trim()) || '',
						gioiTinh: record.gioiTinh?.trim().toLowerCase() as 'nam' | 'nữ' | 'khác',
						ngayCap: record.ngayCap?.trim() ? parseDate(record.ngayCap.trim()) : null,
						noiCap: record.noiCap?.trim() || null,
						role: (record.role?.trim().toLowerCase() as 'user' | 'admin') || 'user',
						// Default values
						hoKhauThuongTru: {
							tinh_ThanhPho: null,
							quanHuyen: null,
							xaPhuong: null,
							diaChi: null,
						}
					};

					// Call API to create record
					const response = await fetch(`${ipLocal}/users`, {
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
				label: 'ID người dùng',
				labels: ['ID người dùng'],
				selected: true
			},
			{
				_id: 'hoTen',
				label: 'Họ và tên',
				labels: ['Họ và tên'],
				selected: true
			},
			{
				_id: 'username',
				label: 'Username',
				labels: ['Username'],
				selected: true
			},
			{
				_id: 'email',
				label: 'Email',
				labels: ['Email'],
				selected: true
			},
			{
				_id: 'password',
				label: 'Mật khẩu',
				labels: ['Mật khẩu'],
				selected: false
			},
			{
				_id: 'soCCCD',
				label: 'Số CCCD',
				labels: ['Số CCCD'],
				selected: true
			},
			{
				_id: 'soDT',
				label: 'Số điện thoại',
				labels: ['Số điện thoại'],
				selected: true
			},
			{
				_id: 'ngaySinh',
				label: 'Ngày sinh',
				labels: ['Ngày sinh'],
				selected: true
			},
			{
				_id: 'gioiTinh',
				label: 'Giới tính',
				labels: ['Giới tính'],
				selected: true
			},
			{
				_id: 'ngayCap',
				label: 'Ngày cấp CCCD',
				labels: ['Ngày cấp CCCD'],
				selected: true
			},
			{
				_id: 'noiCap',
				label: 'Nơi cấp CCCD',
				labels: ['Nơi cấp CCCD'],
				selected: true
			},
			{
				_id: 'hoKhauThuongTru',
				label: 'Hộ khẩu thường trú',
				labels: ['Hộ khẩu thường trú'],
				selected: true
			},
			{
				_id: 'role',
				label: 'Vai trò',
				labels: ['Vai trò'],
				selected: true
			}
		];
	};

	// Hàm format dữ liệu trước khi export
	const formatDataForExport = async (data: User.IRecord[], fields: any[]) => {
		const formattedData = [];
		
		for (const record of data) {
			const row: any = {};
			
			for (const field of fields) {
				switch (field._id) {
					case 'id':
						row['ID người dùng'] = record.id || '';
						break;
					case 'hoTen':
						row['Họ và tên'] = `${record.ho || ''} ${record.ten || ''}`.trim() || 'N/A';
						break;
					case 'username':
						row['Username'] = record.username || 'Chưa có';
						break;
					case 'email':
						row['Email'] = record.email || 'Chưa có';
						break;
					case 'password':
						row['Mật khẩu'] = record.password || 'Chưa có';
						break;
					case 'soCCCD':
						row['Số CCCD'] = record.soCCCD || 'Chưa có';
						break;
					case 'soDT':
						row['Số điện thoại'] = record.soDT || 'Chưa có';
						break;
					case 'ngaySinh':
						row['Ngày sinh'] = record.ngaySinh ? moment(record.ngaySinh).format('DD/MM/YYYY') : 'Chưa có';
						break;
					case 'gioiTinh':
						row['Giới tính'] = record.gioiTinh || 'Chưa có';
						break;
					case 'ngayCap':
						row['Ngày cấp CCCD'] = record.ngayCap ? moment(record.ngayCap).format('DD/MM/YYYY') : 'Chưa có';
						break;
					case 'noiCap':
						row['Nơi cấp CCCD'] = record.noiCap || 'Chưa có';
						break;
					case 'hoKhauThuongTru':
						if (typeof record.hoKhauThuongTru === 'object' && record.hoKhauThuongTru !== null) {
							const addressName = await getAddressName(record.hoKhauThuongTru);
							row['Hộ khẩu thường trú'] = addressName || 'Không có thông tin';
						} else {
							row['Hộ khẩu thường trú'] = 'Không có thông tin';
						}
						break;
					case 'role':
						row['Vai trò'] = record.role || 'Chưa có';
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
			let dataToExport: User.IRecord[] = [];
			
			// Nếu có selectedIds, lấy theo IDs đã chọn
			if (payload.ids && payload.ids.length > 0) {
				const promises = payload.ids.map((id: string) => 
					fetch(`${ipLocal}/users/${id}`).then(res => res.json())
				);
				dataToExport = await Promise.all(promises);
			} else {
				// Lấy toàn bộ dữ liệu
				const response = await fetch(`${ipLocal}/users`);
				dataToExport = await response.json();
				
				// Áp dụng filters nếu có
				if (filters && Object.keys(filters).length > 0) {
					dataToExport = dataToExport.filter(record => {
						return Object.entries(filters).every(([key, value]) => {
							if (!value) return true;
							const recordValue = record[key as keyof User.IRecord];
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
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Người dùng');
			
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
		dangKy,
		// Import functions
		importHeaders,
		getImportHeaderModel,
		getImportTemplateModel,
		postValidateModel,
		postExecuteImpotModel,
		// Export functions
		getExportFieldsModel,
		postExportModel,
	};
}