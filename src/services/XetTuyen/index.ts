import axios from '@/utils/axios';

// Base URL for all endpoints
const BASE_URL = 'http://localhost:3001';

// Hàm request đơn giản
async function request(url: string, options?: any) {
  return axios({
    url,
    ...options
  });
}

// Lấy danh sách hệ đào tạo
export async function fetchHeDaoTao() {
  return request(`${BASE_URL}/heDaoTao`, { method: 'GET' });
}

// Lấy danh sách phương thức xét tuyển
export async function fetchPhuongThucXetTuyen() {
  return request(`${BASE_URL}/phuongThucXetTuyen`, { method: 'GET' });
}

// Lấy danh sách tổ hợp xét tuyển
export async function fetchToHop() {
  return request(`${BASE_URL}/toHop`, { method: 'GET' });
}

// Lấy danh sách ngành đào tạo
export async function fetchNganhDaoTao() {
  return request(`${BASE_URL}/nganhDaoTao`, { method: 'GET' });
}

// Gửi hồ sơ xét tuyển
export async function submitHoSo(data: any) {
  const payload = {
    ...data,
    thongTinHocTap: data.thongTinHocTap || null
  };

  return request(`${BASE_URL}/hoSo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: payload
  });
}

// Upload minh chứng
export async function uploadMinhChung(formData: FormData) {
  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
 
// Theo dõi trạng thái hồ sơ
export async function fetchHoSoByUser(userId: string) {
  return request(`${BASE_URL}/hoSo?thongTinCaNhanId=${userId}`, { method: 'GET' });
}

// Lấy thông tin học tập
export async function fetchThongTinHocTap(userId: string) {
  return request(`${BASE_URL}/thongTinHocTap?userId=${userId}`, { method: 'GET' });
}


  