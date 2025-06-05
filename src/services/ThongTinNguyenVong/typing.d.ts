declare module ThongTinNguyenVong {
	export interface IRecord {
		id: string;
		userId: string;
		thuTuNV: number;
		ten: string;
		phuongThucId: string;
		diemChuaUT: number;
		diemCoUT: number;
		diemDoiTuongUT: number;
		diemKhuVucUT: number;
		tongDiem: number;
		phuongThucXT: string[];
	}
}
