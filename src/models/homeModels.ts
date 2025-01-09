import { DailyStatsBasicModel, DailyStatsDetailModel, MonthlyStatsBasicModel } from "./statsModels";
import { ProductBasicModel } from "./productModels";
import { CustomerBasicModel } from "./customerModels";

export class HomeModel {
    public thisMonthStats: MonthlyStatsBasicModel;
    public lastMonthStats: MonthlyStatsBasicModel;
    public lastestDailyStats: DailyStatsDetailModel[];

    constructor(
            thisMonthStatsResponseDto: ResponseDtos.Stats.MonthlyBasic,
            lastMonthStatsResponseDto: ResponseDtos.Stats.MonthlyBasic,
            latestDailyStatsResponseDtos: ResponseDtos.Stats.DailyDetail[]) {
        this.thisMonthStats = new MonthlyStatsBasicModel(thisMonthStatsResponseDto);
        this.lastMonthStats = new MonthlyStatsBasicModel(lastMonthStatsResponseDto);
        this.lastestDailyStats = latestDailyStatsResponseDtos
            .map(dto => new DailyStatsDetailModel(dto));
    }
}