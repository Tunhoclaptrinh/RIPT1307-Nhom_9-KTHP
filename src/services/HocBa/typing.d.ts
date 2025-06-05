declare module DiemHocSinh {
	export interface IDiemMonHoc {
		mon: string;
		hocKy: string;
		diemTongKet: number;
		ghiChu: string;
	}

	export type LoaiHanhKiem = 'tốt' | 'khá' | 'trung bình' | 'yếu' | 'kém';

	export interface IRecord {
		id: string;
		khoiLop: string;
		userId: string;
		thongTinHocTapId: string;
		diemMonHoc: IDiemMonHoc[];
		loaiHanhKiem: LoaiHanhKiem;
		minhChung: string;
		nhanXetGiaoVien: string;
		xepLoaiHocLuc: string;
		namHoc: string;
	}
}
