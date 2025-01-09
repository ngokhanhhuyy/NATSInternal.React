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

            type LastestMonthly = Partial<{
                monthCount: number;
                includeThisMonth: boolean;
            }>;

            type LastestDaily = Partial<{
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

            type LastestTransactions = Partial<{
                count: number;
            }>;
        }
    }
}

export { };