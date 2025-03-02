declare global {
    namespace RequestDtos {
        namespace Stats {
            type Monthly = Partial<{
                recordedMonth: number;
                recordedYear: number;
            }>;

            type MonthlyList = Partial<{
                year: number;
            }>;

            type LatestMonthly = Partial<{
                monthCount: number;
                includeThisMonth: boolean;
            }>;

            type LatestDaily = Partial<{
                dayCount: number;
                includeToday: boolean;
            }>;

            type TopSoldProductList = Partial<{
                rangeType: string;
                rangeLength: number;
                includeTodayOrThisMonth: boolean;
                creteria: string;
                count: number;
            }>;

            type TopPurchasedCustomerList = Partial<{
                rangeType: string;
                rangeLength: number;
                includeTodayOrThisMonth: boolean;
                creteria: string;
                count: number;
            }>;

            type LatestTransactions = Partial<{
                count: number;
            }>;
        }
    }
}

export { };