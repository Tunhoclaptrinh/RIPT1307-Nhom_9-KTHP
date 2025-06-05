import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';

// API quản lý avatar
export async function postAvatar(userId: string, avatarUrl: string) {
	return axios.post(`${ipLocal}/userAvatars`, {
		userId,
		avatarUrl
	});
}

export async function getAvatar(userId: string) {
	return axios.get(`${ipLocal}/userAvatars?userId=${userId}`);
}

export async function putAvatar(id: string, avatarUrl: string) {
	return axios.put(`${ipLocal}/userAvatars/${id}`, {
		avatarUrl
	});
}

export async function deleteAvatar(id: string) {
	return axios.delete(`${ipLocal}/userAvatars/${id}`);
}

// Giả api lập đăng ký
export async function dangKy(users: User.IRecord) {
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
