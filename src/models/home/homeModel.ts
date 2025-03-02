import { DailyStatsDetailModel } from "../stats/dailyStatsDetailModel";
import { MonthlyStatsBasicModel } from "../stats/monthlyStatsBasicModel";
import { LatestTransactionModel as LatestTransactionModel } from "../stats/latestTransactionModel";
import { TopSoldProductListModel } from "../stats/topSoldProductListModel";
import { TopPurchasedCustomerListModel } from "../stats/topPurchasedCustomerListModel";

type HomeModelConstructorParameters = {
    thisMonthStatsResponseDto: ResponseDtos.Stats.MonthlyBasic;
    lastMonthStatsResponseDto: ResponseDtos.Stats.MonthlyBasic;
    latestDailyStatsResponseDtos: ResponseDtos.Stats.DailyDetail[];
    latestTransactionResponseDtos: ResponseDtos.Stats.LatestTransaction[];
    topSoldProductListResponseDto: ResponseDtos.Stats.TopSoldProductList;
    topPurchasedCustomerListResponseDto: ResponseDtos.Stats.TopPurchasedCustomerList;
    initialDataResponseDto: ResponseDtos.InitialData;
};

export class HomeModel {
    public readonly thisMonthStats: MonthlyStatsBasicModel;
    public readonly lastMonthStats: MonthlyStatsBasicModel;
    public readonly latestDailyStats: DailyStatsDetailModel[];
    public readonly latestTransactions: LatestTransactionModel[];
    public readonly topSoldProducts: TopSoldProductListModel;
    public readonly topPurchasedCustomers: TopPurchasedCustomerListModel;

    constructor(responseDtos: HomeModelConstructorParameters) {
        this.thisMonthStats = new MonthlyStatsBasicModel(
            responseDtos.thisMonthStatsResponseDto);
        this.lastMonthStats = new MonthlyStatsBasicModel(
            responseDtos.lastMonthStatsResponseDto);
        this.latestDailyStats = responseDtos.latestDailyStatsResponseDtos
            .map(dto => new DailyStatsDetailModel(dto));
        this.latestTransactions = responseDtos.latestTransactionResponseDtos
            .map(dto => new LatestTransactionModel(dto));
        this.topSoldProducts = new TopSoldProductListModel(
            responseDtos.topSoldProductListResponseDto,
            responseDtos.initialDataResponseDto.stats.topSoldProduct);
        this.topPurchasedCustomers = new TopPurchasedCustomerListModel(
            responseDtos.topPurchasedCustomerListResponseDto,
            responseDtos.initialDataResponseDto.stats.topPurchasedCustomer);
    }
}