declare module LichTrinhTS {
    export interface IRecord {
        id: string;
        title: string;
        startDate: string;
        endDate: string;
        description: string;
        type: 'dangky' | 'ketqua' | 'nhaphoc';
        icon: string;
        status: 'upcoming' | 'ongoing' | 'completed';
    }
}