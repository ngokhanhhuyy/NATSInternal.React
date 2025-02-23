import { DailyStatsDetailModel } from "../stats/dailyStatsDetailModel";
import { MonthlyStatsBasicModel } from "../stats/monthlyStatsBasicModel";
import { LastestTransactionModel } from "../stats/lastestTransactionModel";
import { TopSoldProductListModel } from "../stats/topSoldProductListModel";
import { TopPurchasedCustomerListModel } from "../stats/topPurchasedCustomerListModel";

type HomeModelConstructorParameters = {
    thisMonthStatsResponseDto: ResponseDtos.Stats.MonthlyBasic;
    lastMonthStatsResponseDto: ResponseDtos.Stats.MonthlyBasic;
    lastestDailyStatsResponseDtos: ResponseDtos.Stats.DailyDetail[];
    lastestTransactionResponseDtos: ResponseDtos.Stats.LastestTransaction[];
    topSoldProductListResponseDto: ResponseDtos.Stats.TopSoldProductList;
    topPurchasedCustomerListResponseDto: ResponseDtos.Stats.TopPurchasedCustomerList;
    initialDataResponseDto: ResponseDtos.InitialData;
};

export class HomeModel {
    public readonly thisMonthStats: MonthlyStatsBasicModel;
    public readonly lastMonthStats: MonthlyStatsBasicModel;
    public readonly lastestDailyStats: DailyStatsDetailModel[];
    public readonly lastestTransactions: LastestTransactionModel[];
    public readonly topSoldProducts: TopSoldProductListModel;
    public readonly topPurchasedCustomers: TopPurchasedCustomerListModel;

    constructor(responseDtos: HomeModelConstructorParameters) {
        this.thisMonthStats = new MonthlyStatsBasicModel(
            responseDtos.thisMonthStatsResponseDto);
        this.lastMonthStats = new MonthlyStatsBasicModel(
            responseDtos.lastMonthStatsResponseDto);
        this.lastestDailyStats = responseDtos.lastestDailyStatsResponseDtos
            .map(dto => new DailyStatsDetailModel(dto));
        this.lastestTransactions = responseDtos.lastestTransactionResponseDtos
            .map(dto => new LastestTransactionModel(dto));
        this.topSoldProducts = new TopSoldProductListModel(
            responseDtos.topSoldProductListResponseDto,
            responseDtos.initialDataResponseDto.stats.topSoldProduct);
        this.topPurchasedCustomers = new TopPurchasedCustomerListModel(
            responseDtos.topPurchasedCustomerListResponseDto,
            responseDtos.initialDataResponseDto.stats.topPurchasedCustomer);
    }
}