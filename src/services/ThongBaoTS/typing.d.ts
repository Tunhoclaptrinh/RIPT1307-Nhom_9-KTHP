declare module ThongBaoTS {
    export interface IRecord {
        id: string;
        title: string;
        date: string;
        summary: string;
        content: string;
        isActive: boolean;
        priority: number;
    }
}
