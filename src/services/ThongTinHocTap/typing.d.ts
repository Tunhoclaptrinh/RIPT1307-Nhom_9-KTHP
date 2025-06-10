// Global import types
export type TImportHeader = {
    field: string;
    label: string;
    type: 'String' | 'Number' | 'Boolean' | 'Date';
    required?: boolean;
};

export type TImportRowResponse = {
    index: number;
    rowErrors?: string[];
};

export type TImportResponse = {
    validate?: TImportRowResponse[];
    error: boolean;
};

// Column interface for tables
export interface IColumn<T = any> {
    title?: React.ReactNode;
    dataIndex?: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    render?: (value: any, record: T, index: number) => React.ReactNode;
    onCell?: (record: T, index?: number) => any;
    sortable?: boolean;
    filterType?: 'string' | 'number' | 'date' | 'select';
}

// Modal import props
export type ModalImportProps = {
    /** Modal có hiện không? */
    visible: boolean;
    /** Đóng modal hoặc làm gì đó */
    onCancel: () => void;
    /** Get data hoặc làm gì đó */
    onOk: () => void;
    /** Tên model kế thừa initModel */
    modelName: any;
    /** Ấn ra ngoài để đóng, mặc định KHÔNG */
    maskCloseableForm?: boolean;
    /** Data thêm vào mỗi record khi validate và execute import */
    extendData?: Record<string, string | number>;
    /** Hàm gọi API để get file import mẫu */
    getTemplate?: () => Promise<Blob>;
    /** Tên file Excel mẫu, mặc định `File biểu mẫu.xlsx` */
    titleTemplate?: string;
};

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
        minhChung: string;
    }

    export interface IRecord {
        id: string;
        userId: string;
        thongTinTHPT: IThongTinTHPT;
        hocBaTHPT: string; // ID tham chiếu đến học bạ
        diemTHPT: IDiemTHPT[];
        diemDGTD: IDiemDGTD;
        diemDGNL: IDiemDGNL;
        giaiHSG?: IGiaiHSG; // Optional to match import logic
        chungChi: IChungChi[];
    }
}

declare module PhuongThucXT {
    export interface IRecord {
        id: string;
        ten: string;
        nguyenTac: string;
    }
}