import axios from '@/utils/axios';
import { ipLocal } from '@/utils/ip';

// API quản lý avatar
export async function postAvatar(userId: string, avatarUrl: any) {
	try {
// Gọi GET để kiểm tra userId đã có avatar chưa
		const response = await getAvatar(userId);
		const existingAvatars = response?.data;

		if (Array.isArray(existingAvatars) && existingAvatars.length > 0) {
// Nếu đã có avatar, cập nhật bản ghi đầu tiên
			const existingAvatar = existingAvatars[0];
			return axios.put(`${ipLocal}/userAvatars/${existingAvatar.id}`, {
				userId,
				avatarUrl,
			});
		} else {
// Nếu chưa có, tạo mới
			return axios.post(`${ipLocal}/userAvatars`, {
				userId,
				avatarUrl,
			});
		}
	} catch (error) {
		console.error('Lỗi xử lý avatar:', error);
		throw error;
	}
}
export async function getAvatar(userId: string) {
	return axios.get(`${ipLocal}/userAvatars?userId=${userId}`);
}

export async function putAvatar(userId: string, avatarUrl: string) {
	return axios.put(`${ipLocal}/userAvatars/${userId}`, {
		avatarUrl
	});
}

export async function deleteAvatar(userId: string) {
	return axios.delete(`${ipLocal}/userAvatars/${userId}`);
}

// Hàm kiểm tra và tạo/cập nhật userProofs (Minh chứng)
export async function postUserProof(userId: string, proofData: any) {
	try {
		// Kiểm tra xem user đã có proof chưa
		const response = await axios.get(`${ipLocal}/userCertificates?userId=${userId}`);
		const existingProofs = response?.data;

		if (Array.isArray(existingProofs) && existingProofs.length > 0) {
			// Nếu đã có, cập nhật bản ghi đầu tiên
			const existingProof = existingProofs[0];
			return axios.put(`${ipLocal}/userCertificates/${existingProof.id}`, {
				userId,
				...proofData,
			});
		} else {
			// Nếu chưa có, tạo mới
			return axios.post(`${ipLocal}/userCertificates`, {
				userId,
				...proofData,
			});
		}
	} catch (error) {
		console.error('Lỗi xử lý userProof:', error);
		throw error;
	}
}
export async function getUserProof(userId: string) {
	return axios.get(`${ipLocal}/userProofs?userId=${userId}`);
}



export async function postUserCerf(userId: string, data: any) {
    try {

        const newData = {
            userId, 
            ...data, 
        };

        return await axios.post(`${ipLocal}/userCertificates`, newData);

    } catch (error: any) {
        console.error('Lỗi tạo mới chứng chỉ:', error?.message || error);
        throw new Error('Không thể tạo chứng chỉ mới cho người dùng.');
    }
}

export async function getUserCertificates(userId: string) {
    try {
        // json-server cho phép lọc theo thuộc tính bằng cách dùng query parameter.
        // Yêu cầu này sẽ tìm tất cả các đối tượng trong 'userCertificates' có trường 'userId' khớp.
        const response = await axios.get(`${ipLocal}/userCertificates?userId=${userId}`);
        
        // response.data sẽ là một mảng các chứng chỉ, ví dụ: [{...}, {...}]
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi khi lấy danh sách chứng chỉ cho người dùng ${userId}:`, error?.message || error);
        // Ném lỗi để nơi gọi hàm có thể xử lý (ví dụ: hiển thị thông báo lỗi trên UI)
        throw new Error('Không thể tải danh sách chứng chỉ.');
    }
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
