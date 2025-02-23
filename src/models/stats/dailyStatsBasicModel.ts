import { DateDisplayModel } from "../dateTime/dateDisplayModel";

export class DailyStatsBasicModel implements IStatsBasicModel {
    public readonly cost: number;
    public readonly expenses: number;
    public readonly grossRevenue: number;
    public readonly netRevenue: number;
    public readonly netProfit: number;
    public readonly newCustomers: number;
    public readonly isTemporarilyClosed: boolean;
    public readonly isOfficialClosed: boolean;
    public readonly recordedDate: DateDisplayModel;

    constructor(responseDto: ResponseDtos.Stats.DailyBasic) {
        this.cost = responseDto.cost;
        this.expenses = responseDto.expenses;
        this.grossRevenue = responseDto.grossRevenue;
        this.netProfit = responseDto.netProfit;
        this.netRevenue = responseDto.netRevenue;
        this.newCustomers = responseDto.newCustomers;
        this.isTemporarilyClosed = responseDto.isTemporarilyClosed;
        this.isOfficialClosed = responseDto.isOfficialClosed;
        this.recordedDate = new DateDisplayModel(responseDto.recordedDate);
    }
}
