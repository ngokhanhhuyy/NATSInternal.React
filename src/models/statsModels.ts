import { Gender, TransactionType, type TransactionDirection } from "@/services/dtos/enums";
import { DateDisplayModel, DateTimeDisplayModel } from "./dateTimeModels";
import { usePhotoUtility } from "@/utilities/photoUtility";
import { useAvatarUtility } from "@/utilities/avatarUtility";
import type { RouteLocationRaw } from "vue-router";

const photoUtility = usePhotoUtility();
const avatarUtility = useAvatarUtility();

export class DailyStatsBasicModel implements IStatsBasicModel {
    public readonly cost: number;
    public readonly expenses: number;
    public readonly grossRevenue: number;
    public readonly netRevenue: number;
    public readonly netProfit: number;
    public readonly newCustomers: number;
    public readonly isTemporarilyClosed: boolean;
    public readonly isOfficialClosed: boolean;
    public readonly recordedDate: IDateDisplayModel;

    constructor(responseDto: ResponseDtos.Stats.DailyBasic) {
        this.cost = responseDto.cost;
        this.expenses = responseDto.expenses;
        this.grossRevenue = responseDto.grossRevenue;
        this.netProfit = responseDto.netProfit;
        this.netRevenue = responseDto.netRevenue;
        this.newCustomers = responseDto.newCustomers;
        this.isTemporarilyClosed = responseDto.isTemporarilyClosed;
        this.isOfficialClosed = responseDto.isOfficialClosed;
        this.recordedDate = new DateDisplayModel(responseDto.recordedDate);
    }
}

export class DailyStatsDetailModel implements IStatsDetailModel {
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
    public readonly temporarilyClosedDateTime: IDateTimeDisplayModel | null;
    public readonly officialClosedDateTime: IDateTimeDisplayModel | null;
    public readonly recordedDate: IDateDisplayModel;

    constructor(responseDto: ResponseDtos.Stats.DailyDetail) {
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
        this.recordedDate = new DateDisplayModel(responseDto.recordedDate);
    }
}

export class MonthlyStatsBasicModel implements IStatsBasicModel {
    public readonly cost: number;
    public readonly expenses: number;
    public readonly grossRevenue: number;
    public readonly netRevenue: number;
    public readonly netProfit: number;
    public readonly newCustomers: number;
    public readonly isTemporarilyClosed: boolean;
    public readonly isOfficialClosed: boolean;
    public readonly recordedMonth: number;
    public readonly recordedYear: number;

    constructor(responseDto: ResponseDtos.Stats.MonthlyBasic) {
        this.cost = responseDto.cost;
        this.expenses = responseDto.expenses;
        this.grossRevenue = responseDto.grossRevenue;
        this.netProfit = responseDto.netProfit;
        this.netRevenue = responseDto.netRevenue;
        this.newCustomers = responseDto.newCustomers;
        this.isTemporarilyClosed = responseDto.isTemporarilyClosed;
        this.isOfficialClosed = responseDto.isOfficialClosed;
        this.recordedMonth = responseDto.recordedMonth;
        this.recordedYear = responseDto.recordedYear;
    }
}

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
    public readonly temporarilyClosedDateTime: IDateTimeDisplayModel | null;
    public readonly officialClosedDateTime: IDateTimeDisplayModel | null;
    public readonly recordedMonth: number;
    public readonly recordedYear: number;

    constructor(responseDto: ResponseDtos.Stats.MonthlyDetail) {
        this.retailGrossRevenue = responseDto.retailGrossRevenue;
        this.treatmentGrossRevenue = responseDto.treatmentGrossRevenue;
        this.consultantGrossRevenue = responseDto.consultantGrossRevenue;
        this.vatCollectedAmount = responseDto.vatCollectedAmount;
        this.debtIncurredAmount = responseDto.debtAmount;
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
        this.recordedMonth = responseDto.recordedMonth;
        this.recordedYear = responseDto.recordedYear;
    }
}

export class TopSoldProductModel {
    public readonly id: number;
    public readonly name: string;
    public readonly unit: string;
    public readonly thumbnailUrl: string;
    public readonly amount: number;
    public readonly quantity: number;

    constructor(responseDto: ResponseDtos.Stats.TopSoldProduct) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.unit = responseDto.unit;
        this.thumbnailUrl = responseDto.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
        this.amount = responseDto.amount;
        this.quantity = responseDto.quantity;
    }

    public get detailRoute(): RouteLocationRaw {
        return { name: "productDetail", params: { productId: this.id } };
    }
}

export class TopSoldProductListModel {
    public readonly startingDate: IDateDisplayModel;
    public readonly endingDate: IDateDisplayModel;
    public readonly rangeType: string;
    public readonly criteria: string;
    public readonly items: TopSoldProductModel[];

    constructor(
            listResponseDto: ResponseDtos.Stats.TopSoldProductList,
            initialResponseDto: ResponseDtos.Stats.TopSoldProductInitial) {
        this.startingDate = new DateDisplayModel(listResponseDto.startingDate);
        this.endingDate = new DateDisplayModel(listResponseDto.endingDate);
        this.items = listResponseDto.items.map(dto => new TopSoldProductModel(dto));
        this.rangeType = initialResponseDto.rangeTypeOptionList.default;
        this.criteria = initialResponseDto.criteriaOptionList.default;
    }
}

export class TopPurchasedCustomerModel {
    public readonly id: number;
    public readonly fullName: string;
    public readonly nickName: string;
    public readonly gender: Gender;
    public readonly avatarUrl: string;
    public readonly purchasedAmount: number;
    public readonly purchasedTransactionCount: number;

    constructor(responseDto: ResponseDtos.Stats.TopPurchasedCustomer) {
        this.id = responseDto.id;
        this.fullName = responseDto.fullName;
        this.nickName = responseDto.nickName;
        this.gender = responseDto.gender;
        this.avatarUrl = avatarUtility.getDefaultAvatarUrlByFullName(this.fullName);
        this.purchasedAmount = responseDto.purchasedAmount;
        this.purchasedTransactionCount = responseDto.purchasedTransactionCount;
    }

    public get detailRoute(): RouteLocationRaw {
        return { name: "customerDetail", params: { customerId: this.id } };
    }
}

export class TopPurchasedCustomerListModel {
    public readonly startingDate: IDateDisplayModel;
    public readonly endingDate: IDateDisplayModel;
    public readonly rangeType: string;
    public readonly criteria: string;
    public readonly items: TopPurchasedCustomerModel[];

    constructor(
            listResponseDto: ResponseDtos.Stats.TopPurchasedCustomerList,
            initialResponseDto: ResponseDtos.Stats.TopPurchasedCustomerInitial) {
        this.startingDate = new DateDisplayModel(listResponseDto.startingDate);
        this.endingDate = new DateDisplayModel(listResponseDto.endingDate);
        this.items = listResponseDto.items.map(dto => new TopPurchasedCustomerModel(dto));
        this.rangeType = initialResponseDto.rangeTypeOptionList.default;
        this.criteria = initialResponseDto.criteriaOptionList.default;
    }
}

export class LastestTransactionModel {
    public readonly id: number;
    public readonly direction: TransactionDirection;
    public readonly type: TransactionType;
    public readonly amount: number;
    public readonly statsDateTime: IDateTimeDisplayModel;

    constructor(responseDto: ResponseDtos.Stats.LastestTransaction) {
        this.id = responseDto.id;
        this.direction = responseDto.direction;
        this.type = responseDto.type;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
    }

    public get detailRoute(): RouteLocationRaw {
        switch (this.type) {
            case TransactionType.Expense:
                return { name: "expenseDetail", params: { expenseId: this.id } };
            case TransactionType.Supply:
                return { name: "supplyDetail", params: { supplyId: this.id } };
            case TransactionType.Consultant:
                return { name: "consultantDetail", params: { consultantId: this.id } };
            case TransactionType.Order:
                return { name: "orderDetail", params: { orderId: this.id } };
            case TransactionType.Treatment:
                return { name: "treatmentDetail", params: { treatmentId: this.id } };
            case TransactionType.DebtIncurrence:
                return { name: "debtIncurrenceDetail", params: { debtIncurrenceId: this.id } };
            case TransactionType.DebtPayment:
                return { name: "debtPaymentDetail", params: { debtPaymentId: this.id } };
            default:
                throw new Error("Not implemented");
        }
    }
}