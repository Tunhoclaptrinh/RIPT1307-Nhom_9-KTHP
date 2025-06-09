import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';
import { HoSo } from './typing';

export async function duyetHoSo(hoso: HoSo.IRecord) {
	try {
		const res = await axios.patch(`${ipLocal}/hoSo/${hoso.id}`, {
			tinhTrang: 'đã duyệt',
		});
		return res.data;
	} catch (error) {
		console.error('Lỗi duyệt hồ sơ:', error);
		throw error;
	}
}

export async function tuChoiHoSo(hoso: HoSo.IRecord) {
	try {
		const res = await axios.patch(`${ipLocal}/hoSo/${hoso.id}`, {
			tinhTrang: 'từ chối',
		});
		return res.data;
	} catch (error) {
		console.error('Lỗi duyệt hồ sơ:', error);
		throw error;
	}
}
