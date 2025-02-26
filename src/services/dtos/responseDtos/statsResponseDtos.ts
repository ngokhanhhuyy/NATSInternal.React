import type { Gender, TransactionDirection, TransactionType } from "@enums";

declare global {
    namespace ResponseDtos {
        namespace Stats {
            type DailyBasic = Implements<IStatsBasicResponseDto, {
                cost: number;
                expenses: number;
                grossRevenue: number;
                netRevenue: number;
                netProfit: number;
                newCustomers: number;
                isTemporarilyClosed: boolean;
                isOfficialClosed: boolean;
                recordedDate: string;
            }>;

            type DailyDetail = Implements<IStatsDetailResponseDto, {
                retailGrossRevenue: number;
                treatmentGrossRevenue: number;
                consultantGrossRevenue: number;
                vatCollectedAmount: number;
                debtIncurredAmount: number;
                debtPaidAmount: number;
                shipmentCost: number;
                supplyCost: number;
                utilitiesExpenses: number;
                equipmentExpenses: number;
                officeExpense: number;
                staffExpense: number;
                cost: number;
                expenses: number;
                grossRevenue: number;
                netRevenue: number;
                grossProfit: number;
                netProfit: number;
                operatingProfit: number;
                newCustomers: number;
                temporarilyClosedDateTime: string | null;
                officialClosedDateTime: string | null;
                recordedDate: string;
            }>;

            type MonthlyBasic = Implements<IStatsBasicResponseDto, {
                cost: number;
                expenses: number;
                grossRevenue: number;
                netRevenue: number;
                netProfit: number;
                newCustomers: number;
                isTemporarilyClosed: boolean;
                isOfficialClosed: boolean;
                recordedMonth: number;
                recordedYear: number;
            }>;

            type MonthlyDetail = Implements<IStatsDetailResponseDto, {
                retailGrossRevenue: number;
                treatmentGrossRevenue: number;
                consultantGrossRevenue: number;
                vatCollectedAmount: number;
                debtIncurredAmount: number;
                debtPaidAmount: number;
                shipmentCost: number;
                supplyCost: number;
                utilitiesExpenses: number;
                equipmentExpenses: number;
                officeExpense: number;
                staffExpense: number;
                cost: number;
                expenses: number;
                grossRevenue: number;
                netRevenue: number;
                grossProfit: number;
                netProfit: number;
                operatingProfit: number;
                newCustomers: number;
                temporarilyClosedDateTime: string | null;
                officialClosedDateTime: string | null;
                recordedMonth: number;
                recordedYear: number;
                dailyStats: DailyBasic[];
            }>;

            type TopSoldProduct = {
                id: number;
                name: string;
                unit: string;
                thumbnailUrl: string | null;
                amount: number;
                quantity: number;
            };

            type TopSoldProductList = {
                startingDate: string;
                endingDate: string;
                items: TopSoldProduct[];
            };

            type TopPurchasedCustomer = {
                id: number;
                fullName: string;
                nickName: string;
                gender: Gender;
                purchasedAmount: number;
                purchasedTransactionCount: number;
            };

            type TopPurchasedCustomerList = {
                startingDate: string;
                endingDate: string;
                items: TopPurchasedCustomer[];
            };

            type LastestTransaction = {
                id: number;
                direction: TransactionDirection;
                type: TransactionType;
                amount: number;
                statsDateTime: string;
            };

            type RangeTypeOption = {
                name: string;
                displayName: string;
            };
            
            type RangeTypeOptionList = {
                options: RangeTypeOption[];
                default: string;
            };

            type StatsRangeTypeOption = {
                name: string;
                displayName: string;
            };

            type StatsRangeTypeOptionList = {
                options: StatsRangeTypeOption[];
                default: string;
            }

            type StatsCriteriaOption = {
                name: string;
                displayName: string;
            };

            type StatsCriteriaOptionList = {
                options: StatsCriteriaOption[];
                default: string;
            };

            type TopSoldProductInitial = {
                rangeTypeOptionList: StatsRangeTypeOptionList;
                criteriaOptionList: StatsCriteriaOptionList;
            };

            type TopPurchasedCustomerInitial = {
                rangeTypeOptionList: StatsRangeTypeOptionList;
                criteriaOptionList: StatsCriteriaOptionList;
            };

            type Initial = {
                topSoldProduct: TopSoldProductInitial;
                topPurchasedCustomer: TopPurchasedCustomerInitial;
            };
        }
    }
}

export { };