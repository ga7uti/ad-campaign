export interface Location {
    id:number
    country: string;
    state: string;
    city: string;
    tier: string;
    population: number;
}

export interface CommonSelectResponse{
    id: number,
    value: string
}

export interface Interest{
    id: number,
    targeting_type: string
    category: string
}

export interface Images {
    id: number;
    image: string;
    created_at: string;
}

export interface FileUpload{
    id: number;
    file: string;
};

export interface Campaign {
    id: number;
    images: Images[];
    keywords: FileUpload[]; 
    name: string;
    age: string[]; 
    day_part: string;
    device: string[]; 
    environment: string[]; 
    exchange: string[];
    target_type: Interest[]; 
    created_at: string; 
    updated_at: string; 
    language: string[];
    carrier: string[]; 
    device_price: string[];  
    proximity_store: FileUpload[]; 
    proximity: FileUpload[];
    weather: FileUpload[]; 
    location: Location[];
}

export interface CampaignFormData  {
    name: string;
    age: string[];
    device: string[];
    environment: string[];
    location: number[];
    images: number[];
    keywords: number[];
    distinct_interest: string[];
    target_type: number[];
    exchange: string[];
    language: string[];
    carrier: string[];
    device_price: string[];
    proximity_store?: number[];
    proximity?: number[];
    weather?: number[];
};
  