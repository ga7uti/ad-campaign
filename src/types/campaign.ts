export interface Image {
    id: number;
    image: string;
    created_at: string;
}

export interface Logo {
    id: number;
    logo: string;
    created_at: string;
}

export interface TargetDemographic {
    id: number;
    name: string;
}

export interface Keyword {
    id: number;
    keyword: string;
}

export interface Topic {
    id: number;
    topic: string;
}

export interface Campaign {
    age:string
}