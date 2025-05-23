declare module DiemHocSinh {
    export interface IDiemMonHoc {
        mon: string;            
        hocKy: string;          
        diemTongKet: number;    
    }

    export type LoaiHanhKiem = 'tốt' | 'khá' | 'trung bình' | 'yếu' | 'kém';

    export interface IRecord {
        id: string;                  
        diemMonHoc: IDiemMonHoc[];   
        loaiHanhKiem: LoaiHanhKiem;  
        minhChung: string;           
    }
}