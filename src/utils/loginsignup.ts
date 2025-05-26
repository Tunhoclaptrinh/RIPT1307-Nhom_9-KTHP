import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';

// Giả lập api đăng ký đăng nhập
export async function dangKy(users: User.IRecord) {
	return axios.post(`${ipLocal}/users`, users);
}

export async function dangNhap(soCCCD: string, password: string) {
	return axios.post(`${ipLocal}/users/login`, { soCCCD, password });
}

export async function getUserById(id: string) {
	return axios.get(`${ipLocal}/users/${id}`);
}

export async function getAllUsers() {
	return axios.get(`${ipLocal}/users`);
}
