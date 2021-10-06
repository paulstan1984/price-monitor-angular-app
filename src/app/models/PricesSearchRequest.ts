import { SearchRequest } from "./SearchRequest";

export interface PricesSearchRequest extends SearchRequest {
    product?: string | undefined;
	store?: string | undefined;
    date?: string | undefined;
    category_ids: number[] | undefined;
}
