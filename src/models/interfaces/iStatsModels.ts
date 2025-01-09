import type { DateDisplayModel } from "../dateTime/dateDisplayModel";

declare global {
    interface IStatsBasicModel {
        readonly cost: number;
        readonly expenses: number;
        readonly grossRevenue: number;
        readonly netRevenue: number;
        readonly netProfit: number;
        readonly newCustomers: number;
        readonly isTemporarilyClosed: boolean;
        isOfficialClosed: boolean;
    }

    interface IStatsDetailModel {
        readonly retailGrossRevenue: number;
        readonly treatmentGrossRevenue: number;
        readonly consultantGrossRevenue: number;
        readonly vatCollectedAmount: number;
        readonly debtAmount: number;
        readonly debtPaidAmount: number;
        readonly shipmentCost: number;
        readonly supplyCost: number;
        readonly utilitiesExpenses: number;
        readonly equipmentExpenses: number;
        readonly officeExpense: number;
        readonly staffExpense: number;
        readonly cost: number;
        readonly expenses: number;
        readonly grossRevenue: number;
        readonly netRevenue: number;
        readonly grossProfit: number;
        readonly netProfit: number;
        readonly operatingProfit: number;
        readonly newCustomers: number;
        readonly temporarilyClosedDateTime: DateDisplayModel | null;
        readonly officialClosedDateTime: DateDisplayModel | null;
    }
}

export { };