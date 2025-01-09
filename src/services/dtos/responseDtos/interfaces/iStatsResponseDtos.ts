declare global {
    namespace ResponseDtos {
        interface IStatsBasicResponseDto {
            cost: number;
            expenses: number;
            grossRevenue: number;
            netRevenue: number;
            netProfit: number;
            newCustomers: number;
            isTemporarilyClosed: boolean;
            isOfficialClosed: boolean;
        }

        interface IStatsDetailResponseDto {
            retailGrossRevenue: number;
            treatmentGrossRevenue: number;
            consultantGrossRevenue: number;
            vatCollectedAmount: number;
            debtAmount: number;
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
        }
    }
}

export { };