import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { message } from 'antd';
import * as XLSX from 'xlsx';

export default () => {
	const objInt = useInitModel<PhuongThucXT.IRecord>('phuongThucXetTuyen', undefined, undefined, ipLocal);

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
					fetch(`http://localhost:3000/phuongThucXetTuyen/${id}`).then(res => res.json())
				);
				dataToExport = await Promise.all(promises);
			} else {
				// Lấy toàn bộ dữ liệu
				const response = await fetch('http://localhost:3000/phuongThucXetTuyen');
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
		getExportFieldsModel,
		postExportModel,
	};
};