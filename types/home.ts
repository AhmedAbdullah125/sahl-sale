export interface Banner {
    id: number;
    title: string;
    image: string;
    url: string;
}

export interface PinningPrice {
    id: number;
    position: string;
    price: string;
}

export interface CarInfo {
    brand: string;
    model: string;
    year: string;
}

export interface Ad {
    id: number;
    title: string;
    price: string;
    ad_form: string;
    type: "ad" | "auction";
    parent_category: string;
    category: string | null;
    is_pinned: boolean;
    car?: CarInfo;
    image: string;
    latest_bid?: string | null;
    my_bid?: boolean;
    created_at: string;
    ended_at: string;
    status: string;
    is_favorite: boolean;
}

export interface Category {
    id: number;
    name: string;
    image: string;
    sub_categories_count: number | null;
    has_children: boolean;
    ad_fee: string;
    auction_fee: string;
    active_pinning_prices: PinningPrice[];
    ads: Ad[];
    slug?: string;
}

export interface HomeData {
    banners: Banner[];
    categories: Category[];
    "my-bids": Ad[];
    auctions: Ad[];
    pinned_ads: Ad[];
    categories_with_ads: Category[];
}
