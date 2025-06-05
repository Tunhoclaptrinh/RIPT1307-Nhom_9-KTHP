declare module User {
	export interface IRecord {
		id: string;
		password: string;
		username?: string;
		soCCCD: string;
		ngayCap: string;
		noiCap: string;
		ho: string;
		ten: string;
		hoKhauThuongTru: HoKhauThuongTru | string | number | {} | null; // Union type to handle inconsistent data;
		ngaySinh: string;
		gioiTinh: 'nam' | 'nữ' | 'khác';
		email: string;
		soDT: string;
		password?: string;
		avatar?: string;
		role: 'user' | 'admin';
	}

	export type HoKhauThuongTru = {
		tinh_ThanhPho: string;
		quanHuyen: string;
		xaPhuong: string;
		diaChi: string;
	};
}

// interface User {
// 	IRecord: {
// 		id: string;
// 		password?: string;
// 		username: string;
// 		soCCCD: string;
// 		ngayCap: string;
// 		noiCap: string;
// 		ho: string;
// 		ten: string;
// 		hoKhauThuongTru:
// 			| {
// 					tinh_ThanhPho: string;
// 					quanHuyen: string;
// 					xaPhuong: string;
// 					diaChi: string;
// 			  }
// 			| string
// 			| number; // Union type to handle inconsistent data
// 		ngaySinh: string;
// 		gioiTinh: string;
// 		email: string;
// 		soDT: string;
// 		avatar?: string;
// 		role?: string;
// 		thongTinBoSung?: {
// 			danToc?: string;
// 			quocTich?: string;
// 			tonGiao?: string;
// 		};
// 	};
// }
