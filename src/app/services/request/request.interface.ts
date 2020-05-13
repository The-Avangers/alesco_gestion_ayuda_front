export interface Request {
    id: number;
    id_user: number;
    id_aid: number;
    created_at: Date | string;
    aid: string;
    user_name: string;
    email: string;
    approved: boolean;
    status: string;
    statusnumber: number;
    unit: string;
}
export interface PostRequest {
    id_user: number;
    id_aid: number;
}
