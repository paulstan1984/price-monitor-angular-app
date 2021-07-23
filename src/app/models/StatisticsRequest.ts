
export interface StatisticsRequest {
    StartDate: Date | string | undefined | null;
    EndDate: Date | string | undefined | null;
	ProductsIds: number[];
    StoresIds: number[];
    GrouppingType: string;
}

export interface StatisticsResponse {
    name: string;
    series: StatisticsValue[]
}

export interface StatisticsValue {
    name: Date | string;
    value: number;
    max: number;
    min: number;
}
