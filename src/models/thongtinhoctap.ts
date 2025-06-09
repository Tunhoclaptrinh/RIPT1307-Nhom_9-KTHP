import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { message } from 'antd';
import * as XLSX from 'xlsx';

export default () => {
	const objInt = useInitModel<ThongTinHocTap.IRecord>('thongTinHocTap', undefined, undefined, ipLocal);

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
				_id: 'thongTinTHPT',
				label: 'Thông tin THPT',
				labels: ['Thông tin THPT'],
				children: [
					{
						_id: 'thongTinTHPT_ten',
						label: 'Tên trường',
						labels: ['Thông tin THPT', 'Tên trường'],
						selected: true
					},
					{
						_id: 'thongTinTHPT_maTruong',
						label: 'Mã trường',
						labels: ['Thông tin THPT', 'Mã trường'],
						selected: true
					},
					{
						_id: 'thongTinTHPT_tinh_ThanhPho',
						label: 'Tỉnh/Thành phố',
						labels: ['Thông tin THPT', 'Tỉnh/Thành phố'],
						selected: true
					}
				]
			},
			{
				_id: 'daTotNghiep',
				label: 'Trạng thái tốt nghiệp',
				labels: ['Trạng thái tốt nghiệp'],
				selected: true
			},
			{
				_id: 'namTotNghiep',
				label: 'Năm tốt nghiệp',
				labels: ['Năm tốt nghiệp'],
				selected: true
			},
			{
				_id: 'khuVucUT',
				label: 'Khu vực ưu tiên',
				labels: ['Khu vực ưu tiên'],
				selected: true
			},
			{
				_id: 'doiTuongUT',
				label: 'Đối tượng ưu tiên',
				labels: ['Đối tượng ưu tiên'],
				selected: true
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
						selected: true
					},
					{
						_id: 'diemTHPT_detail',
						label: 'Chi tiết từng môn',
						labels: ['Điểm THPT', 'Chi tiết từng môn'],
						selected: false
					}
				]
			},
			{
				_id: 'diemDGTD',
				label: 'Điểm đánh giá tư duy',
				labels: ['Điểm đánh giá tư duy'],
				selected: true
			},
			{
				_id: 'diemDGNL',
				label: 'Điểm đánh giá năng lực',
				labels: ['Điểm đánh giá năng lực'],
				selected: true
			},
			{
				_id: 'giaiHSG',
				label: 'Giải học sinh giỏi',
				labels: ['Giải học sinh giỏi'],
				selected: true
			},
			{
				_id: 'chungChi',
				label: 'Chứng chỉ',
				labels: ['Chứng chỉ'],
				selected: true
			},
			{
				_id: 'hocBaTHPT',
				label: 'Học bạ THPT',
				labels: ['Học bạ THPT'],
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
	const formatDataForExport = async (data: ThongTinHocTap.IRecord[], fields: any[]) => {
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
						row['Trạng thái tốt nghiệp'] = record.thongTinTHPT?.daTotNghiep ? 'Đã tốt nghiệp' : 'Chưa tốt nghiệp';
						break;
					case 'namTotNghiep':
						row['Năm tốt nghiệp'] = record.thongTinTHPT?.namTotNghiep ? new Date(record.thongTinTHPT.namTotNghiep).getFullYear().toString() : '';
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
								.map(d => `${d.mon}: ${d.diem}`)
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
							? record.chungChi.map(cc => `${cc.loaiCC}: ${cc.ketQua}`).join('; ')
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
		otherQuery?: any
	) => {
		try {
			let dataToExport: ThongTinHocTap.IRecord[] = [];
			
			// Nếu có selectedIds, lấy theo IDs đã chọn
			if (payload.ids && payload.ids.length > 0) {
				const promises = payload.ids.map((id: string) => 
					fetch(`http://localhost:3000/thongTinHocTap/${id}`).then(res => res.json())
				);
				dataToExport = await Promise.all(promises);
			} else {
				// Lấy toàn bộ dữ liệu
				const response = await fetch('http://localhost:3000/thongTinHocTap');
				dataToExport = await response.json();
				
				// Áp dụng filters nếu có
				if (filters && Object.keys(filters).length > 0) {
					dataToExport = dataToExport.filter(record => {
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