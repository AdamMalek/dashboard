export interface IData{
    colors: string[];
    labels: string[];
    timestamp: number;
    data: IChartData[];
}

export interface IChartData{
    date: Date;
    revenue: number[];
    installations: number[];
} 
