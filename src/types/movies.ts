export interface MovieType {
    id: number;
    user_id: number;
    title: string | null;
    summary: string;
    thumbnail: string | null;
    dateRelease: Date;
    yearRelease: number;
    revenue: number;
}
