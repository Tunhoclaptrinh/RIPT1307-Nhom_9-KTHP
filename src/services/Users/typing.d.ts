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
		hoKhauThuongTru: HoKhauThuongTru;
		ngaySinh: string;
		gioiTinh: 'nam' | 'nữ' | 'khác';
		email: string;
		soDT: string;
		password?: string;
	}

	export type HoKhauThuongTru = {
		tinh_ThanhPho: string;
		quanHuyen: string;
		xaPhuong: string;
		diaChi: string;
	};
}
