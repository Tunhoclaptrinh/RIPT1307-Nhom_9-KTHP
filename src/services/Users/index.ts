import axios from '@/utils/axios';

export async function getUserById(userId: string) {
	return axios.get(`http://localhost:3001/users/${userId}`);
}

export async function createUser(userData: Partial<User.IRecord>) {
	return axios.post(`http://localhost:3001/users`, userData);
}

export async function updateUser(userId: string, userData: Partial<User.IRecord>) {
	return axios.put(`http://localhost:3001/users/${userId}`, userData);
}

export async function deleteUser(userId: string) {
	return axios.delete(`http://localhost:3001/users/${userId}`);
}
