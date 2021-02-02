import { SearchRequest } from "./SearchRequest";

export interface ProductsSearchRequest extends SearchRequest {
    name: string | undefined;
	category: string | undefined;
}
