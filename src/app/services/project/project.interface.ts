export interface Project {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    price: number;
    paid: boolean | string;
    institutionName: string;
}

export interface PostProject {
    name: string;
    startDate: string;
    endDate: string;
    price: number;
    institutionId: number;
    people: {
        id: number,
        role: string,
    }[];
}
