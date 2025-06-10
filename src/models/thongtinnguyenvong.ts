import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { message } from 'antd';
import * as XLSX from 'xlsx';

export default () => {
	const objInt = useInitModel<ThongTinNguyenVong.IRecord>('thongTinNguyenVong', undefined, undefined, ipLocal);

	// Định nghĩa các trường có thể export
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
						selected: true
					},
					{
						_id: 'userFullName',
						label: 'Họ và tên',
						labels: ['Thông tin thí sinh', 'Họ và tên'],
						selected: true
					}
				]
			},
			{
				_id: 'maNganh',
				label: 'Mã ngành',
				labels: ['Mã ngành'],
				selected: true
			},
			{
				_id: 'thuTuNV',
				label: 'Thứ tự nguyện vọng',
				labels: ['Thứ tự nguyện vọng'],
				selected: true
			},
			{
				_id: 'ten',
				label: 'Tên nguyện vọng',
				labels: ['Tên nguyện vọng'],
				selected: true
			},
			{
				_id: 'phuongThucXT',
				label: 'Phương thức xét tuyển',
				labels: ['Phương thức xét tuyển'],
				selected: true
			},
			{
				_id: 'diemChuaUT',
				label: 'Điểm chưa ưu tiên',
				labels: ['Điểm chưa ưu tiên'],
				selected: true
			},
			{
				_id: 'diemCoUT',
				label: 'Điểm có ưu tiên',
				labels: ['Điểm có ưu tiên'],
				selected: true
			},
			{
				_id: 'diemDoiTuongUT',
				label: 'Điểm đối tượng ưu tiên',
				labels: ['Điểm đối tượng ưu tiên'],
				selected: true
			},
			{
				_id: 'diemKhuVucUT',
				label: 'Điểm khu vực ưu tiên',
				labels: ['Điểm khu vực ưu tiên'],
				selected: true
			},
			{
				_id: 'tongDiem',
				label: 'Tổng điểm',
				labels: ['Tổng điểm'],
				selected: true
			},
			{
				_id: 'phuongThucId',
				label: 'ID phương thức xét tuyển',
				labels: ['ID phương thức xét tuyển'],
				selected: false
			}
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
	const formatDataForExport = async (data: ThongTinNguyenVong.IRecord[], fields: any[]) => {
		const formattedData = [];
		
		for (const record of data) {
			const row: any = {};
			
			// Lấy thông tin user nếu cần
			let userInfo = null;
			if (fields.some(f => f._id.includes('user'))) {
				userInfo = await getUserInfo(record.userId);
			}
			
			for (const field of fields) {
				switch (field._id) {
					case 'userId':
						row['ID thí sinh'] = record.userId;
						break;
					case 'userFullName':
						row['Họ và tên'] = userInfo ? `${userInfo.ho || ''} ${userInfo.ten || ''}`.trim() : 'N/A';
						break;
					case 'maNganh':
						row['Mã ngành'] = record.maNganh || '';
						break;
					case 'thuTuNV':
						row['Thứ tự nguyện vọng'] = record.thuTuNV || '';
						break;
					case 'ten':
						row['Tên nguyện vọng'] = record.ten || '';
						break;
					case 'phuongThucXT':
						row['Phương thức xét tuyển'] = record.phuongThucXT && record.phuongThucXT.length > 0
							? record.phuongThucXT.join('; ')
							: '';
						break;
					case 'diemChuaUT':
						row['Điểm chưa ưu tiên'] = record.diemChuaUT || 0;
						break;
					case 'diemCoUT':
						row['Điểm có ưu tiên'] = record.diemCoUT || 0;
						break;
					case 'diemDoiTuongUT':
						row['Điểm đối tượng ưu tiên'] = record.diemDoiTuongUT || 0;
						break;
					case 'diemKhuVucUT':
						row['Điểm khu vực ưu tiên'] = record.diemKhuVucUT || 0;
						break;
					case 'tongDiem':
						row['Tổng điểm'] = record.tongDiem || 0;
						break;
					case 'phuongThucId':
						row['ID phương thức xét tuyển'] = record.phuongThucId || '';
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
			let dataToExport: ThongTinNguyenVong.IRecord[] = [];
			
			// Nếu có selectedIds, lấy theo IDs đã chọn
			if (payload.ids && payload.ids.length > 0) {
				const promises = payload.ids.map((id: string) => 
					fetch(`${ipLocal}/thongTinNguyenVong/${id}`).then(res => res.json())
				);
				dataToExport = await Promise.all(promises);
			} else {
				// Lấy toàn bộ dữ liệu
				const response = await fetch(`${ipLocal}/thongTinNguyenVong`);
				dataToExport = await response.json();
				
				// Áp dụng filters nếu có
				if (filters && Object.keys(filters).length > 0) {
					dataToExport = dataToExport.filter(record => {
						return Object.entries(filters).every(([key, value]) => {
							if (!value) return true;
							const recordValue = record[key as keyof ThongTinNguyenVong.IRecord];
							if (typeof recordValue === 'string') {
								return recordValue.toLowerCase().includes(value.toString().toLowerCase());
							}
							if (Array.isArray(recordValue)) {
								return recordValue.some(item => 
									item.toLowerCase().includes(value.toString().toLowerCase())
								);
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
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Nguyện vọng');
			
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
		getExportFieldsModel,
		postExportModel,
	};
};