// admissionService.js
import axios from 'axios';

// Base URL cho json-server (thay đổi theo cấu hình của bạn)
const BASE_URL = 'http://localhost:3001';

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Service để xử lý các API calls liên quan đến hồ sơ xét tuyển
export const admissionService = {
	// 1. Tạo/Cập nhật thông tin cá nhân
	async createOrUpdateUser(userData) {
		try {
			// Kiểm tra user đã tồn tại chưa
			const existingUsers = await api.get(`/users?email=${userData.email}`);

			if (existingUsers.data.length > 0) {
				// Cập nhật user hiện có
				const userId = existingUsers.data[0].id;
				const response = await api.put(`/users/${userId}`, {
					...existingUsers.data[0],
					...userData,
					updatedAt: new Date().toISOString(),
				});
				return response.data;
			} else {
				// Tạo user mới
				const newUser = {
					id: `user_${Date.now()}`,
					...userData,
					role: 'user',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};
				const response = await api.post('/users', newUser);
				return response.data;
			}
		} catch (error) {
			console.error('Error creating/updating user:', error);
			throw error;
		}
	},

	// 2. Tạo thông tin học tập THPT
	async createThongTinHocTap(userId, educationData) {
		try {
			const thongTinHocTap = {
				id: `ttht_${Date.now()}`,
				userId: userId,
				thongTinTHPT: educationData.thongTinTHPT,
				diemTHPT: educationData.diemTHPT || [],
				diemDGTD: educationData.diemDGTD || null,
				diemDGNL: educationData.diemDGNL || null,
				giaiHSG: educationData.giaiHSG || null,
				chungChi: educationData.chungChi || [],
				createdAt: new Date().toISOString(),
			};

			const response = await api.post('/thongTinHocTap', thongTinHocTap);
			return response.data;
		} catch (error) {
			console.error('Error creating education info:', error);
			throw error;
		}
	},

	// 3. Tạo học bạ
	async createHocBa(userId, thongTinHocTapId, gradesData) {
		try {
			const hocBa = {
				id: `hb_${Date.now()}`,
				userId: userId,
				thongTinHocTapId: thongTinHocTapId,
				diemMonHoc: gradesData.diemMonHoc || [],
				loaiHanhKiem: gradesData.loaiHanhKiem || 'tốt',
				minhChung: gradesData.minhChung || '',
				createdAt: new Date().toISOString(),
			};

			const response = await api.post('/hocBa', hocBa);

			// Cập nhật thông tin học tập với hocBaId
			await api.patch(`/thongTinHocTap/${thongTinHocTapId}`, {
				hocBaId: hocBa.id,
			});

			return response.data;
		} catch (error) {
			console.error('Error creating grades:', error);
			throw error;
		}
	},

	// 4. Tạo thông tin nguyện vọng
	async createNguyenVong(userId, wishesData) {
		try {
			const nguyenVongList = [];

			for (let i = 0; i < wishesData.length; i++) {
				const nguyenVong = {
					id: `ttnv_${Date.now()}_${i}`,
					userId: userId,
					thuTuNV: i + 1,
					maNganh: wishesData[i].maNganh || '',
					ten: wishesData[i].ten,
					coSoDaoTao: wishesData[i].coSoDaoTao || 'Cơ sở chính',
					phuongThucId: wishesData[i].phuongThucId,
					diemChuaUT: wishesData[i].diemChuaUT,
					diemCoUT: wishesData[i].diemCoUT,
					diemDoiTuongUT: wishesData[i].diemDoiTuongUT || 0,
					diemKhuVucUT: wishesData[i].diemKhuVucUT || 0,
					tongDiem: wishesData[i].tongDiem,
					phuongThucXT: [wishesData[i].phuongThucXT || ''],
					createdAt: new Date().toISOString(),
				};

				const response = await api.post('/thongTinNguyenVong', nguyenVong);
				nguyenVongList.push(response.data);
			}

			return nguyenVongList;
		} catch (error) {
			console.error('Error creating wishes:', error);
			throw error;
		}
	},

	// 5. Tạo hồ sơ chính
	async createHoSo(userId, thongTinHocTapId, nguyenVongIds, additionalInfo) {
		try {
			const hoSo = {
				id: `HOSO${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
				thongTinCaNhanId: userId,
				thongTinHocTapId: thongTinHocTapId,
				thongTinBoSung: additionalInfo.thongTinBoSung || {
					danToc: 'kinh',
					quocTich: 'Việt Nam',
					tonGiao: 'không',
					noiSinh: {
						trongNuoc: true,
						tinh_ThanhPho: '',
					},
				},
				thongTinLienHe: additionalInfo.thongTinLienHe || {
					ten: '',
					diaChi: {
						tinh_ThanhPho: '',
						quanHuyen: '',
						xaPhuong: '',
						diaChiCuThe: '',
					},
				},
				nguyenVong: nguyenVongIds,
				tinhTrang: 'chờ duyệt',
				ketQua: null,
				createdAt: new Date().toISOString(),
				submittedAt: new Date().toISOString(),
			};

			const response = await api.post('/hoSo', hoSo);
			return response.data;
		} catch (error) {
			console.error('Error creating application:', error);
			throw error;
		}
	},

	// 6. API tổng hợp để tạo toàn bộ hồ sơ
	async submitCompleteApplication(formData) {
		try {
			console.log('Starting application submission...', formData);

			// Bước 1: Tạo/cập nhật thông tin user
			const userData = {
				username: formData.username || formData.email?.split('@')[0],
				email: formData.email,
				password: formData.password || '123456', // Default password
				ho: formData.ho,
				ten: formData.ten,
				ngaySinh: formData.ngaySinh,
				gioiTinh: formData.gioiTinh,
				soDT: formData.soDT,
				soCCCD: formData.soCCCD,
				ngayCap: formData.ngayCap,
				noiCap: formData.noiCap,
				hoKhauThuongTru: formData.hoKhauThuongTru || {
					tinh_ThanhPho: null,
					quanHuyen: null,
					xaPhuong: null,
					diaChi: null,
				},
			};

			const user = await this.createOrUpdateUser(userData);
			console.log('User created/updated:', user.id);

			// Bước 2: Tạo thông tin học tập
			const educationData = {
				thongTinTHPT: formData.thongTinTHPT,
				diemTHPT: formData.diemTHPT,
				diemDGTD: formData.diemDGTD,
				diemDGNL: formData.diemDGNL,
				giaiHSG: formData.giaiHSG,
				chungChi: formData.chungChi,
			};

			const thongTinHocTap = await this.createThongTinHocTap(user.id, educationData);
			console.log('Education info created:', thongTinHocTap.id);

			// Bước 3: Tạo học bạ
			const gradesData = {
				diemMonHoc: formData.diemMonHoc,
				loaiHanhKiem: formData.loaiHanhKiem,
				minhChung: formData.minhChung,
			};

			const hocBa = await this.createHocBa(user.id, thongTinHocTap.id, gradesData);
			console.log('Grades created:', hocBa.id);

			// Bước 4: Tạo nguyện vọng
			const nguyenVongList = await this.createNguyenVong(user.id, formData.nguyenVong || []);
			const nguyenVongIds = nguyenVongList.map((nv) => nv.id);
			console.log('Wishes created:', nguyenVongIds);

			// Bước 5: Tạo hồ sơ chính
			const additionalInfo = {
				thongTinBoSung: formData.thongTinBoSung,
				thongTinLienHe: formData.thongTinLienHe,
			};

			const hoSo = await this.createHoSo(user.id, thongTinHocTap.id, nguyenVongIds, additionalInfo);
			console.log('Application created:', hoSo.id);

			return {
				success: true,
				data: {
					user,
					thongTinHocTap,
					hocBa,
					nguyenVong: nguyenVongList,
					hoSo,
				},
				message: 'Hồ sơ đã được tạo thành công!',
			};
		} catch (error) {
			console.error('Error submitting complete application:', error);
			return {
				success: false,
				error: error.message,
				message: 'Có lỗi xảy ra khi tạo hồ sơ!',
			};
		}
	},

	// 7. API để lấy thông tin hồ sơ
	async getApplicationById(hoSoId) {
		try {
			const hoSo = await api.get(`/hoSo/${hoSoId}`);
			return hoSo.data;
		} catch (error) {
			console.error('Error getting application:', error);
			throw error;
		}
	},

	// 8. API để lấy danh sách hồ sơ của user
	async getApplicationsByUserId(userId) {
		try {
			const response = await api.get(`/hoSo?thongTinCaNhanId=${userId}`);
			return response.data;
		} catch (error) {
			console.error('Error getting user applications:', error);
			throw error;
		}
	},

	// 9. API để cập nhật trạng thái hồ sơ
	async updateApplicationStatus(hoSoId, status, result = null) {
		try {
			const updateData = {
				tinhTrang: status,
				updatedAt: new Date().toISOString(),
			};

			if (result) {
				updateData.ketQua = result;
			}

			const response = await api.patch(`/hoSo/${hoSoId}`, updateData);
			return response.data;
		} catch (error) {
			console.error('Error updating application status:', error);
			throw error;
		}
	},

	// 10. API helper để lấy dữ liệu tham chiếu
	async getReferenceData() {
		try {
			const [heDaoTao, phuongThucXT, toHop, nganhDaoTao] = await Promise.all([
				api.get('/heDaoTao'),
				api.get('/phuongThucXetTuyen'),
				api.get('/toHop'),
				api.get('/nganhDaoTao'),
			]);

			return {
				heDaoTao: heDaoTao.data,
				phuongThucXetTuyen: phuongThucXT.data,
				toHop: toHop.data,
				nganhDaoTao: nganhDaoTao.data,
			};
		} catch (error) {
			console.error('Error getting reference data:', error);
			throw error;
		}
	},
};

export default admissionService;
