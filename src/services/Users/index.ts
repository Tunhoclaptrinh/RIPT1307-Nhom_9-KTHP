import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';

// Giả api lập đăng ký
export async function dangKy(users: User.IRecord) {
	return axios.post(`${ipLocal}/users`, users);
}

// export async function dangNhap(user: User.IRecord) {
// 	return axios.get((`${ipLocal}`)).then (res. map)

// }
