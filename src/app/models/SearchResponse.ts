
export interface SearchResponse<T> {
    count: number;
    page: number;
    page_size: number;
    nr_pages: number;
    results: T[];
}
