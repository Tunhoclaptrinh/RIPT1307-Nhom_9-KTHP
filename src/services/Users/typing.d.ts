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
		hoKhauThuongTru: {
			tinh_ThanhPho: string;
			quanHuyen: string;
			xaPhuong: string;
			diaChi: string;
		};
		ngaySinh: string;
		gioiTinh: 'nam' | 'nữ' | 'khác';
		email: string;
		soDT: string;
	}
}
