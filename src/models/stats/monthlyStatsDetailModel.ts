import { DailyStatsBasicModel } from "@models/stats/dailyStatsBasicModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";

export class MonthlyStatsDetailModel implements IStatsDetailModel {
    public readonly retailGrossRevenue: number;
    public readonly treatmentGrossRevenue: number;
    public readonly consultantGrossRevenue: number;
    public readonly vatCollectedAmount: number;
    public readonly debtIncurredAmount: number;
    public readonly debtPaidAmount: number;
    public readonly shipmentCost: number;
    public readonly supplyCost: number;
    public readonly utilitiesExpenses: number;
    public readonly equipmentExpenses: number;
    public readonly officeExpense: number;
    public readonly staffExpense: number;
    public readonly cost: number;
    public readonly expenses: number;
    public readonly grossRevenue: number;
    public readonly netRevenue: number;
    public readonly grossProfit: number;
    public readonly netProfit: number;
    public readonly operatingProfit: number;
    public readonly newCustomers: number;
    public readonly temporarilyClosedDateTime: DateTimeDisplayModel | null;
    public readonly officialClosedDateTime: DateTimeDisplayModel | null;
    public readonly recordedYear: number;
    public readonly recordedMonth: number;
    public readonly dailyStats: DailyStatsBasicModel[];

    constructor(responseDto: ResponseDtos.Stats.MonthlyDetail) {
        this.retailGrossRevenue = responseDto.retailGrossRevenue;
        this.treatmentGrossRevenue = responseDto.treatmentGrossRevenue;
        this.consultantGrossRevenue = responseDto.consultantGrossRevenue;
        this.vatCollectedAmount = responseDto.vatCollectedAmount;
        this.debtIncurredAmount = responseDto.debtIncurredAmount;
        this.debtPaidAmount = responseDto.debtPaidAmount;
        this.shipmentCost = responseDto.shipmentCost;
        this.supplyCost = responseDto.supplyCost;
        this.utilitiesExpenses = responseDto.utilitiesExpenses;
        this.equipmentExpenses = responseDto.equipmentExpenses;
        this.officeExpense = responseDto.officeExpense;
        this.staffExpense = responseDto.staffExpense;
        this.cost = responseDto.cost;
        this.expenses = responseDto.expenses;
        this.grossRevenue = responseDto.grossRevenue;
        this.netRevenue = responseDto.netRevenue;
        this.grossProfit = responseDto.grossProfit;
        this.netProfit = responseDto.netProfit;
        this.operatingProfit = responseDto.operatingProfit;
        this.newCustomers = responseDto.newCustomers;
        this.temporarilyClosedDateTime = responseDto.temporarilyClosedDateTime != null
            ? new DateTimeDisplayModel(responseDto.temporarilyClosedDateTime)
            : null;
        this.officialClosedDateTime = responseDto.officialClosedDateTime != null
            ? new DateTimeDisplayModel(responseDto.officialClosedDateTime)
            : null;
        this.recordedYear = responseDto.recordedYear;
        this.recordedMonth = responseDto.recordedMonth;
        this.dailyStats = responseDto.dailyStats.map(ds => new DailyStatsBasicModel(ds));
    }
}