export interface IData{
    labels: string[];
    timestamp: number;
    data: IChartData[];
}

export interface IChartData{
    date: Date;
    revenue: number[];
    installations: number[];
} 
