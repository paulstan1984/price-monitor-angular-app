import { SearchRequest } from "./SearchRequest";

export interface StoresSearchRequest extends SearchRequest {
    name: string | undefined;
}
