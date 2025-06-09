import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { message } from 'antd';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default () => {
	const objInt = useInitModel<DiemHocSinh.IRecord>('hocBa', undefined, undefined, ipLocal);

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
				_id: 'khoiLop',
				label: 'Khối lớp',
				labels: ['Khối lớp'],
				selected: true
			},
			{
				_id: 'namHoc',
				label: 'Năm học',
				labels: ['Năm học'],
				selected: true
			},
			{
				_id: 'diemMonHoc',
				label: 'Điểm các môn học',
				labels: ['Điểm các môn học'],
				children: [
					{
						_id: 'diemMonHoc_summary',
						label: 'Tóm tắt điểm',
						labels: ['Điểm các môn học', 'Tóm tắt điểm'],
						selected: true
					},
					{
						_id: 'diemMonHoc_detail',
						label: 'Chi tiết từng môn',
						labels: ['Điểm các môn học', 'Chi tiết từng môn'],
						selected: false
					}
				]
			},
			{
				_id: 'loaiHanhKiem',
				label: 'Loại hạnh kiểm',
				labels: ['Loại hạnh kiểm'],
				selected: true
			},
			{
				_id: 'xepLoaiHocLuc',
				label: 'Xếp loại học lực',
				labels: ['Xếp loại học lực'],
				selected: true
			},
			{
				_id: 'minhChung',
				label: 'Minh chứng',
				labels: ['Minh chứng'],
				selected: false
			},
			{
				_id: 'nhanXetGiaoVien',
				label: 'Nhận xét giáo viên',
				labels: ['Nhận xét giáo viên'],
				selected: false
			}
		];
	};

	// Hàm lấy thông tin user từ API users
	const getUserInfo = async (userId: string) => {
		try {
			const response = await fetch(`http://localhost:3000/users/${userId}`);
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
	const formatDataForExport = async (data: DiemHocSinh.IRecord[], fields: any[]) => {
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
					case 'khoiLop':
						row['Khối lớp'] = record.khoiLop || '';
						break;
					case 'namHoc':
						row['Năm học'] = record.namHoc || '';
						break;
					case 'diemMonHoc_summary':
						if (record.diemMonHoc && record.diemMonHoc.length > 0) {
							row['Điểm các môn'] = record.diemMonHoc
								.map(d => `${d.mon}: ${d.diemTongKet}`)
								.join('; ');
						} else {
							row['Điểm các môn'] = 'Chưa có điểm';
						}
						break;
					case 'diemMonHoc_detail':
						if (record.diemMonHoc && record.diemMonHoc.length > 0) {
							record.diemMonHoc.forEach((diem, index) => {
								row[`Môn ${index + 1} - Tên`] = diem.mon;
								row[`Môn ${index + 1} - Học kỳ`] = diem.hocKy;
								row[`Môn ${index + 1} - Điểm`] = diem.diemTongKet;
								row[`Môn ${index + 1} - Ghi chú`] = diem.ghiChu || '';
							});
						}
						break;
					case 'loaiHanhKiem':
						row['Loại hạnh kiểm'] = record.loaiHanhKiem || '';
						break;
					case 'xepLoaiHocLuc':
						row['Xếp loại học lực'] = record.xepLoaiHocLuc || '';
						break;
					case 'minhChung':
						row['Minh chứng'] = record.minhChung || '';
						break;
					case 'nhanXetGiaoVien':
						row['Nhận xét giáo viên'] = record.nhanXetGiaoVien || '';
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
			let dataToExport: DiemHocSinh.IRecord[] = [];
			
			// Nếu có selectedIds, lấy theo IDs đã chọn
			if (payload.ids && payload.ids.length > 0) {
				const promises = payload.ids.map((id: string) => 
					fetch(`http://localhost:3000/hocBa/${id}`).then(res => res.json())
				);
				dataToExport = await Promise.all(promises);
			} else {
				// Lấy toàn bộ dữ liệu
				const response = await fetch('http://localhost:3000/hocBa');
				dataToExport = await response.json();
				
				// Áp dụng filters nếu có
				if (filters && Object.keys(filters).length > 0) {
					dataToExport = dataToExport.filter(record => {
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
			
			// Format dữ liệu theo các trường đã chọn
			const formattedData = await formatDataForExport(dataToExport, payload.definitions);
			
			// Tạo workbook Excel
			const worksheet = XLSX.utils.json_to_sheet(formattedData);
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Học bạ');
			
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