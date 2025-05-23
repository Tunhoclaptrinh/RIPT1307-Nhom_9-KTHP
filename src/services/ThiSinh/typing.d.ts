declare module ThiSinh {
	export interface IRecord {
		id: string;
		password: string;
		username: string;
		soCCCD: string | number;
		ngayCap: string | Date;
		noiCap: string;
		ho: string;
		(họ);
		ten: string;
		(tên);
		hoKhauThuongTru: hoKhauThuongTru.IRecord;
		ngaySinh: string | Date;
		gioiTinh: 'nam' | 'nữ' | 'khác';
		email: string;
		(email);
		soDT: string | number;
	}
}

declare module hoKhauThuongTru {
	export interface IRecord {
		tinh_ThanhPho: string;
		quanHuyen: string;
		xaPhuong: string;
		diaChi: string;
	}
}
