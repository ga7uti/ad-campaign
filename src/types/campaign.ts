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
    id: number;
    images: Image[];
    logos: Logo[];
    target_demographics: TargetDemographic[];
    keywords: Keyword[];
    topics: Topic[];
    final_url: string;
    business_name: string;
    campaign_type: string;
    text: string;
    geo_location: string;
    budget: string;
    file: string | null;
    created_at: string;
    updated_at: string;
    language: string;
    bidding: string;
    bidding_focus: string;
    target_people: string;
    target_content: string;
    target_optimize: boolean;
    video: string | null;
}