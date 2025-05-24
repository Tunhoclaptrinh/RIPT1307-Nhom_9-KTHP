declare module ThongBaoTS {
    export interface IRecord {
        id: string;
        question: string;
        answer: string;
        category: string;
        isActive: boolean;
        viewCount: number;
    }
}
