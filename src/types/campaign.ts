export interface Location {
    id:number
    country: string;
    state: string;
    city: string;
    tier: string;
    population: number;
}
export interface Partners{
    id: number,
    name: string
}

export interface Age{
    id: number,
    range: string
}

export interface Interest{
    id: number,
    name: string
    subcategory: string
}

export interface Campaign {
    age:string
}