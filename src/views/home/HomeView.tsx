import React, { useState, useEffect } from "react";
import { HomeModel } from "@/models/home/homeModel";
import { useStatsService } from "@/services/statsService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Layout component.
import MainContainer from "@layouts/MainContainerComponent";

// Child components.
import SmallStatistics from "./SmallStatisticsComponent";
import FinanceAreaGraph from "./FinanceAreaGraphComponent";
import RevenueDistributionGraph from "./distributionGraphs/RevenueDistributionGraphComponent";
import ExpenseAndCostGraph from "./distributionGraphs/ExpenseAndCostGraphComponent";
import LastestTransactionList from "./LastestTransactionListComponent";
import TopSoldProductList from "./TopSoldProductListComponent";
import TopPurchasedCustomerList from "./TopPurchasedCustomerListComponent";
import Logo from "./LogoComponent";

// Component.
const HomeView = () => {
    // Dependencies.
    const statsService = useStatsService();
    const initialData = useInitialDataStore(store => store.data);
    const getUndefinedErrorConfirmationAsync = useAlertModalStore(store => {
        return store.getUndefinedErrorConfirmationAsync;
    });

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [model, setModel] = useState<HomeModel>();

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                const [
                    [thisMonthStatsResponseDto, lastMonthStatsResponseDto],
                    lastestDailyStatsResponseDtos,
                    lastestTransactionResponseDtos,
                    topSoldProductListResponseDto,
                    topPurchasedCustomerListResponseDto
                ] = await Promise.all([
                    statsService.getLastestMonthlyAsync({ monthCount: 2 }),
                    statsService.getLastestDailyDetailAsync({ dayCount: 10 }),
                    statsService.getLastestTransactionsAsync(),
                    statsService.getTopSoldProductListAsync(),
                    statsService.getTopPurchasedCustomerListAsync()
                ]);
    
                setModel(new HomeModel({
                    thisMonthStatsResponseDto,
                    lastMonthStatsResponseDto,
                    lastestDailyStatsResponseDtos,
                    lastestTransactionResponseDtos,
                    topSoldProductListResponseDto,
                    topPurchasedCustomerListResponseDto,
                    initialDataResponseDto: initialData
                }));
            } catch {
                await getUndefinedErrorConfirmationAsync();
                location.reload();
            }
        };

        loadAsync().finally(onInitialLoadingFinished);
    }, []);

    // Computed.
    const firstRowColumnClass = "col col-xxl-3 col-lg-6 col-md-6 col-sm-12 col-12";

    // Callback.
    const formatAmount = (amount: number): string => {
        if (amount === 0) {
            return "0";
        }

        if (Math.abs(amount) > 1_000_000_000) {
            return `${(amount / 1_000_000_000).toFixed(0)} Tỉ`.replaceAll(".", ",");
        }

        if (Math.abs(amount) > 100_000_000) {
            return `${(amount / 1_000_000).toFixed(0)}Tr`.replaceAll(".", ",");
        }

        if (Math.abs(amount) > 10_000_000) {
            return `${(amount / 1_000_000).toFixed(1)}Tr`.replaceAll(".", ",");
        }

        if (Math.abs(amount) > 1_000_000) {
            return `${(amount / 1_000_000).toFixed(2)}Tr`.replaceAll(".", ",");
        }

        return `${(amount / 1_000).toFixed(2)}N`.replaceAll(".", ",");
    };

    if (!model) {
        return null;
    }

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            {/* This month row */}
            <div className="row g-3">
                <div className="col col-12 fs-5 pb-0 fw-bold d-flex
                                justify-content-start text-primary mt-2">
                    {"Tháng này".toUpperCase()}
                </div>
                {/* Net Revenue */}
                <div className={firstRowColumnClass}>
                    <SmallStatistics
                        title="Doanh thu ròng"
                        unit="vnđ"
                        color="primary"
                        thisMonthStats={model.thisMonthStats}
                        lastMonthStats={model.lastMonthStats}
                        statsPropertySelector={(stats) => stats.netRevenue}
                        statsPropertyFormatter={formatAmount}
                    />
                </div>

                {/* Expense and Cost */}
                <div className={firstRowColumnClass}>
                    <SmallStatistics
                        title="Chi phí"
                        unit="vnđ"
                        color="danger"
                        thisMonthStats={model.thisMonthStats}
                        lastMonthStats={model.lastMonthStats}
                        statsPropertySelector={(stats) => stats.expenses + stats.cost}
                        statsPropertyFormatter={formatAmount}
                    />
                </div>

                {/* Net Profit */}
                <div className={firstRowColumnClass}>
                    <SmallStatistics
                        title="Lợi nhuận ròng"
                        unit="vnđ"
                        color="success"
                        thisMonthStats={model.thisMonthStats}
                        lastMonthStats={model.lastMonthStats}
                        statsPropertySelector={(stats) => stats.netProfit}
                        statsPropertyFormatter={formatAmount}
                    />
                </div>

                {/* New Customers */}
                <div className={firstRowColumnClass}>
                    <SmallStatistics
                        title="Khách hàng mới"
                        unit="khách"
                        color="purple"
                        thisMonthStats={model.thisMonthStats}
                        lastMonthStats={model.lastMonthStats}
                        statsPropertySelector={(stats) => stats.newCustomers}
                    />
                </div>
            </div>

            {/* Last 7 days row */}
            <div className="row g-3 align-items-stretch mt-3">
                <div className="col col-12 fs-5 pb-0 fw-bold d-flex 
                                justify-content-start text-primary">
                    {"7 ngày gần nhất".toUpperCase()}
                </div>
                <div className="col col-xl-8 col-lg-7 col-md-6 col-12">
                    <FinanceAreaGraph height={380} model={model.lastestDailyStats} />
                </div>
                <div className="col p-0">
                    <div className="row g-3">
                        <div className="col col-12">
                            <RevenueDistributionGraph model={model.lastestDailyStats} />
                        </div>
                        <div className="col col-12">
                            <ExpenseAndCostGraph model={model.lastestDailyStats} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Ranking row */}
            <div className="row g-3 align-items-stretch mt-3">
                <div className="col col-12 fs-5 pb-0 fw-bold d-flex 
                                justify-content-start text-primary">
                    {"Xếp hạng".toUpperCase()}
                </div>

                {/* Lastest transaction list */}
                <div className="col col-xxl-3 col-md-6 col-12">
                    <LastestTransactionList model={model.lastestTransactions} />
                </div>

                {/* Top sold products list */}
                <div className="col col-xxl-3 col-md-6 col-12">
                    <TopSoldProductList model={model.topSoldProducts} />
                </div>

                {/* Top purchased customers list */}
                <div className="col col-xxl-3 col-md-6 col-12">
                    <TopPurchasedCustomerList model={model.topPurchasedCustomers} />
                </div>

                {/* Logo */}
                <div className="col col-xxl-3 col-md-6 col-12">
                    <Logo />
                </div>
            </div>
        </MainContainer>
    );
};

export default HomeView;