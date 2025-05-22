import axios from '@/utils/axios';

// Hàm request wrapper đơn giản
async function request(url: string, options?: any) {
  return axios({
    url,
    ...options
  });
}

// Đăng nhập
export async function login(username: string, password: string) {
  const response = await request(`http://localhost:3000/users?username=${username}`, {
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
  // Kiểm tra username hoặc email đã tồn tại
  const checkUser = await request(
    `http://localhost:3000/users?username=${userData.username}&email=${userData.email}`
  );
  
  if (checkUser.data.length > 0) {
    throw new Error('Username hoặc email đã tồn tại');
  }

  const response = await request('/users', {
    method: 'POST',
    data: {
      ...userData,
      id: `user_${Math.random().toString(36).substr(2, 8)}`
    }
  });

  if (response.status >= 400) {
    throw new Error('Đăng ký thất bại');
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
}
