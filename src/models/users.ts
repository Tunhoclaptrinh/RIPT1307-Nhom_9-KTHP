import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { dangKy } from '../services/Users/index';
import { message } from 'antd';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { useAddress } from '@/hooks/useAddress';

export default () => {
	const objInt = useInitModel<User.IRecord>('users', undefined, undefined, ipLocal);
	const { getAddressName } = useAddress();

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
		getExportFieldsModel,
		postExportModel,
	};
};