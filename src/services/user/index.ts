import axios from '@/utils/axios';
import { history } from 'umi'; 

// Hàm request wrapper đơn giản
async function request(url: string, options?: any) {
  return axios({
    url,
    ...options
  });
}

// Đăng nhập
export async function login(username: string, password: string) {
  const response = await request(`http://localhost:3001/users?username=${username}`, {
    method: 'GET'
  });
  
  if (!response.data || response.data.length === 0) {
    throw new Error('Tài khoản không tồn tại');
  }

  const user = response.data[0];
  if (user.password !== password) {
    throw new Error('Mật khẩu không chính xác');
  }

  return user;
}

// Đăng ký user mới
export async function register(userData: any) {
  // Validate dữ liệu đầu vào
  if (!userData.username || !userData.password || !userData.email) {
    throw new Error('Vui lòng điền đầy đủ thông tin');
  }

  // Kiểm tra username hoặc email đã tồn tại
  const checkUser = await request(
    `http://localhost:3001/users?username=${userData.username}&email=${userData.email}`
  );
  
  if (checkUser.data.length > 0) {
    throw new Error('Username hoặc email đã tồn tại');
  }

  // Tạo user mới
  const response = await request('http://localhost:3001/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
  });

  if (!response.data) {
    throw new Error('Đăng ký thất bại, vui lòng thử lại');
  }

  return response.data;
}

// Lấy thông tin user
export async function getUserInfo(userId: string) {
  return request(`/users/${userId}`, {
    method: 'GET'
  });
}

// Đăng xuất (xử lý ở client side)
export function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  history.push('/trang-chu');
  
}


export const useCheckUserAndRedirect = () => {
    const userInfo = localStorage.getItem('userInfo');
    const userId = userInfo ? JSON.parse(userInfo) : null;

    if (userId) {
      history.push('/xet-tuyen');
    } else {
      history.push('/user');
    }
};
