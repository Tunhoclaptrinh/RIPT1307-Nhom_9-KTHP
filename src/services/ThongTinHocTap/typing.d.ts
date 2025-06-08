declare module ThongTinHocTap {
	export type DoiTuongUT = 'hộ nghèo' | 'cận nghèo' | string;
	export type KhuVucUT = 'kv1' | 'kv2' | 'kv2NT' | 'kv3' | string;
	export type MonThi = 'toán' | 'văn' | 'anh' | string;
	export type GiaiCap = 'thành phố' | 'tỉnh' | 'quốc gia' | 'quốc tế';
	export type LoaiGiai = 'nhất' | 'nhì' | 'ba' | 'khuyến khích';
	export type LoaiCC = 'tiếng anh' | 'tin học' | string;

	export interface IThongTinTHPT {
		ten: string;
		tinh_ThanhPho: string;
		quanHuyen: string;
		xaPhuong: string;
		diaChi: string;
		maTruong: string;
		maTinh: string;
		doiTuongUT: DoiTuongUT;
		khuVucUT: KhuVucUT;
		daTotNghiep: boolean;
		namTotNghiep: string | Date;
	}

	export interface IDiemTHPT {
		mon: MonThi;
		diem: number;
	}

	export interface IDiemMonTuDuy {
		ten: string;
		diem: number;
		minhChung: string;
	}

	export interface IDiemDGTD {
		mon: IDiemMonTuDuy[];
		minhChung: string;
		tongDiem: number;
	}

	export interface IDiemDGNL {
		mon: IDiemMonTuDuy[];
		minhChung: string;
		tongDiem: number;
	}

	export interface IGiaiHSG {
		giaiHsgCap: GiaiCap;
		mon: MonThi;
		loaiGiai: LoaiGiai;
		nam: string | Date;
		noiCap: string;
		minhChung: string;
	}

	export interface IChungChi {
		loaiCC: LoaiCC;
		ketQua: string | number;
		minhChung: {
			fileList: {
				thumbUrl: string;
			}[];
		};
	}

	export interface IRecord {
		id: string;
		userId: string;
		thongTinTHPT: IThongTinTHPT;
		hocBaTHPT: string; // ID tham chiếu đến học bạ
		diemTHPT: IDiemTHPT[];
		diemDGTD: IDiemDGTD;
		diemDGNL: IDiemDGNL;
		giaiHSG: IGiaiHSG;
		chungChi: IChungChi[];
	}
}
