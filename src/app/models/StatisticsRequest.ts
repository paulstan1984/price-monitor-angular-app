export interface TimeIntervalRequest {
    StartDate: Date | string | undefined | null;
    EndDate: Date | string | undefined | null;
}

export interface StatisticsRequest extends TimeIntervalRequest{
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
