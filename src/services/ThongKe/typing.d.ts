declare module ThongKe {
	export interface NganhDaoTao {
		ma: string;
		ten: string;
		toHopXetTuyenId: string;
	}

	export interface NguyenVong {
		id: string;
		maNganh: string;
		tongDiem?: number;
		ten: string;
		phuongThucId: string;
	}

	export interface PhuongThuc {
		id: string;
		ten: string;
	}

	export interface ToHop {
		id: string;
		monHoc: string[];
	}

	export interface HoSo {
		id: string;
		thongTinLienHe?: {
			ten?: string;
			diaChi?: {
				diaChiCuThe?: string;
				xaPhuong?: string;
				quanHuyen?: string;
				tinh_ThanhPho?: string;
			};
		};
		tinhTrang?: string;
		ketQua?: {
			succes?: boolean;
			nguyenVong?: string;
			phuongThucId?: string;
			diem?: number;
		};
		nguyenVong?: string[];
		diem?: number;
	}
	interface MajorStats {
		count: number;
		candidates: HoSo[];
	}

	interface StatusStats {
		count: number;
		candidates: HoSo[];
	}

	interface Stats {
		admittedByMajor: Record<string, MajorStats>;
		wishesByMajor: Record<string, number>;
		wishesByScore: Record<string, number>;
		wishesByAdmissionMethod: Record<string, number>;
		admittedByAdmissionMethod: Record<string, number>;
		profileStats: { total: number; approved: number; pending: number };
		profileStatus: Record<string, StatusStats>;
	}
}
