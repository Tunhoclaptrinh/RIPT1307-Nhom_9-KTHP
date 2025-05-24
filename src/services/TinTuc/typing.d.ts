declare module TinTuc {
    export interface IRecord {
        id: string;
        title: string;
        summary: string;
        content: string;
        date: string;
        author: string;
        category: string;
        featured: boolean;
        imageUrl: string;
    }
}