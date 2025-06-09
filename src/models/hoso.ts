import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { message } from 'antd';
import * as XLSX from 'xlsx';
import { HoSo } from '@/services/HoSo/typing';

export default () => {
	const objInt = useInitModel<HoSo.IRecord>('hoSo', undefined, undefined, ipLocal);

	// Định nghĩa các trường có thể export
	const getExportFieldsModel = async () => {
		return [
			{
				_id: 'thongTinLienHe',
				label: 'Thông tin liên hệ',
				labels: ['Thông tin liên hệ'],
				children: [
					{
						_id: 'thongTinLienHe_ten',
						label: 'Họ và tên',
						labels: ['Thông tin liên hệ', 'Họ và tên'],
						selected: true,
					},
					{
						_id: 'thongTinLienHe_diaChi',
						label: 'Địa chỉ',
						labels: ['Thông tin liên hệ', 'Địa chỉ'],
						selected: true,
					},
				],
			},
			{
				_id: 'thongTinBoSung',
				label: 'Thông tin bổ sung',
				labels: ['Thông tin bổ sung'],
				children: [
					{
						_id: 'thongTinBoSung_danToc',
						label: 'Dân tộc',
						labels: ['Thông tin bổ sung', 'Dân tộc'],
						selected: true,
					},
					{
						_id: 'thongTinBoSung_quocTich',
						label: 'Quốc tịch',
						labels: ['Thông tin bổ sung', 'Quốc tịch'],
						selected: true,
					},
					{
						_id: 'thongTinBoSung_tonGiao',
						label: 'Tôn giáo',
						labels: ['Thông tin bổ sung', 'Tôn giáo'],
						selected: true,
					},
					{
						_id: 'thongTinBoSung_noiSinh',
						label: 'Nơi sinh',
						labels: ['Thông tin bổ sung', 'Nơi sinh'],
						selected: true,
					},
				],
			},
			{
				_id: 'tinhTrang',
				label: 'Tình trạng',
				labels: ['Tình trạng'],
				selected: true,
			},
			{
				_id: 'nguyenVong',
				label: 'Nguyện vọng',
				labels: ['Nguyện vọng'],
				selected: true,
			},
			{
				_id: 'ketQua',
				label: 'Kết quả',
				labels: ['Kết quả'],
				children: [
					{
						_id: 'ketQua_summary',
						label: 'Tóm tắt kết quả',
						labels: ['Kết quả', 'Tóm tắt kết quả'],
						selected: true,
					},
				],
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
	const formatDataForExport = async (data: HoSo.IRecord[], fields: any[]) => {
		const formattedData = [];

		for (const record of data) {
			const row: any = {};

			// Lấy thông tin user nếu cần
			let userInfo = null;
			if (fields.some((f: any) => f._id.includes('thongTinLienHe'))) {
				userInfo = await getUserInfo(record.thongTinCaNhanId);
			}

			for (const field of fields) {
				switch (field._id) {
					case 'thongTinLienHe_ten':
						row['Họ và tên'] = record.thongTinLienHe?.ten || 'N/A';
						break;
					case 'thongTinLienHe_diaChi':
						const diaChi = record.thongTinLienHe?.diaChi;
						row['Địa chỉ'] = diaChi
							? `${diaChi.diaChiCuThe}, ${diaChi.xaPhuong}, ${diaChi.quanHuyen}, ${diaChi.tinh_ThanhPho}`
							: 'N/A';
						break;
					case 'thongTinBoSung_danToc':
						row['Dân tộc'] = record.thongTinBoSung?.danToc || 'N/A';
						break;
					case 'thongTinBoSung_quocTich':
						row['Quốc tịch'] = record.thongTinBoSung?.quocTich || 'N/A';
						break;
					case 'thongTinBoSung_tonGiao':
						row['Tôn giáo'] = record.thongTinBoSung?.tonGiao || 'N/A';
						break;
					case 'thongTinBoSung_noiSinh':
						const noiSinh = record.thongTinBoSung?.noiSinh;
						row['Nơi sinh'] = noiSinh && noiSinh.trongNuoc ? noiSinh.tinh_ThanhPho : 'Nước ngoài';
						break;
					case 'tinhTrang':
						row['Tình trạng'] = record.tinhTrang || 'N/A';
						break;
					case 'nguyenVong':
						row['Nguyện vọng'] = record.nguyenVong?.join('; ') || 'N/A';
						break;
					case 'ketQua_summary':
						const ketQua = record.ketQua;
						row['Kết quả'] = ketQua
							? `${ketQua.nguyenVongDo} - Điểm: ${ketQua.diem} - ${ketQua.succes ? 'Đạt' : 'Không đạt'}`
							: 'Chưa có kết quả';
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
			let dataToExport: HoSo.IRecord[] = [];

			// Nếu có selectedIds, lấy theo IDs đã chọn
			if (payload.ids && payload.ids.length > 0) {
				const promises = payload.ids.map((id: string) =>
					fetch(`${ipLocal}/hoSo/${id}`).then((res) => res.json())
				);
				dataToExport = await Promise.all(promises);
			} else {
				// Lấy toàn bộ dữ liệu
				const response = await fetch(`${ipLocal}/hoSo`);
				dataToExport = await response.json();

				// Áp dụng filters nếu có
				if (filters && Object.keys(filters).length > 0) {
					dataToExport = dataToExport.filter((record) => {
						return Object.entries(filters).every(([key, value]) => {
							if (!value) return true;
							const recordValue = key.includes('thongTinLienHe')
								? record.thongTinLienHe?.[key.split('_')[1]]
								: key.includes('thongTinBoSung')
								? record.thongTinBoSung?.[key.split('_')[1]]
								: record[key as keyof HoSo.IRecord];
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
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Hồ sơ');

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
		getExportFieldsModel,
		postExportModel,
	};
};