import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';
import { HoSo } from './typing';

// Giả lập api duyệt
export async function duyetHoSo(hoso: HoSo.) {
	return axios.post(`${ipLocal}/users`, {
		...users,
		ngayCap: null,
		noiCap: null,
		hoKhauThuongTru: {
			tinh_ThanhPho: null,
			quanHuyen: null,
			xaPhuong: null,
			diaChi: null,
		},
	});
}

// export async function dangNhap(user: User.IRecord) {
// 	return axios.get((`${ipLocal}`)).then (res. map)

// }
