import axios from '@/utils/axios';

// Hàm lấy danh sách tỉnh/thành phố
export async function getfetchProvinces() {
  const res = await axios.get('https://vnprovinces.pythonanywhere.com/api/provinces/?basic=true&limit=100');
  return res.data.results;
}

// Hàm lấy danh sách quận/huyện theo tỉnh/thành phố
export async function getfetchDistricts(provinceId: number) {
  const res = await axios.get(`https://vnprovinces.pythonanywhere.com/api/districts/?province_id=${provinceId}&basic=true&limit=100`);
  return res.data.results;
}

// Hàm lấy danh sách phường/xã theo quận/huyện
export async function getfetchWards(districtId: number) {
  const res = await axios.get(`https://vnprovinces.pythonanywhere.com/api/wards/?district_id=${districtId}&basic=true&limit=100`);
  return res.data.results;
}
