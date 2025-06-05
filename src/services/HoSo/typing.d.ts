import { IRecord } from './../ThongBao/typing.d';
declare module HoSo {
	export type DanToc = 'kinh' | 'mông' | 'mèo' | string;

	export type QuocTich = 'Việt Nam' | 'Lào' | 'Campuchia' | string;

	export type TonGiao = 'không' | 'Thiên Chúa giáo' | 'Phật giáo' | string;

	export interface INoiSinh {
		trongNuoc: boolean;
		tinh_ThanhPho: string;
	}

	export interface IThongTinBoSung {
		danToc: DanToc;
		quocTich: QuocTich;
		tonGiao: TonGiao;
		noiSinh: INoiSinh;
	}

	export interface IDiaChi {
		tinh_ThanhPho: string;
		quanHuyen: string;
		xaPhuong: string;
		diaChiCuThe: string;
	}

	export interface IThongTinLienHe {
		ten: string;
		diaChi: IDiaChi;
	}

	export interface IRecord {
		id: string;
		thongTinCaNhanId: string; //Chính là userId
		thongTinHocTapId: string;
		thongTinBoSung: IThongTinBoSung;
		thongTinLienHe: IThongTinLienHe;
		tinhTrang: TTinhTrang;
		nguyenVong: TNguyenVong;
		ketQua: IKetQua;
	}

	// export type nguyenVong = string;

	export type TTinhTrang = 'chờ duyệt' | 'đã duyệt' | 'từ chối';

	export type TNguyenVong = string[];

	export interface IKetQua {
		succes: boolean;
		nguyenVongDo: string;
		phuongThucId: string;
		diem: number;
	}
}
