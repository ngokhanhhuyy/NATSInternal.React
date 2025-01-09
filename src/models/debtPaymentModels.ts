import type { RouteLocationRaw } from "vue-router";
import { DebtPaymentUpdateHistoryModel } from "./debtPaymentUpdateHistoryModels";
import { CustomerBasicModel } from "./customerModels";
import { UserBasicModel } from "./userModels";
import { ListMonthYearOptionsModel, ListMonthYearModel } from "./listMonthYearModels";
import { ListSortingOptionsModel } from "./listSortingModels";
import { DateTimeDisplayModel, StatsDateTimeInputModel } from "./dateTimeModels";

export class DebtPaymentBasicModel implements IDebtBasicModel<
        DebtPaymentExistingAuthorizationModel> {
    public readonly id: number;
    public readonly amount: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly authorization: DebtPaymentExistingAuthorizationModel;

    constructor(responseDto: ResponseDtos.DebtPayment.Basic) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.isLocked = responseDto.isLocked;
        this.authorization = new DebtPaymentExistingAuthorizationModel(responseDto.authorization!);
    }

    public get detailRoute(): RouteLocationRaw {
        return { name: "debtPaymentDetail", params: { debtPaymentId: this.id } };
    }

    public get updateRoute(): RouteLocationRaw {
        return { name: "debtPaymentUpdate", params: { debtPaymentId: this.id } };
    }
}

export class DebtPaymentListModel implements IDebtListModel<
        DebtPaymentBasicModel, DebtPaymentExistingAuthorizationModel> {
    public sortingByAscending: boolean | undefined;
    public sortingByField: string | undefined;
    public monthYear: ListMonthYearModel | undefined;
    public customerId: number | undefined;
    public createdUserId: number | undefined;
    public page: number = 1;
    public resultsPerPage: number = 15;
    public items: DebtPaymentBasicModel[] = [];
    public pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: RouteLocationRaw = { name: "debtPaymentCreate" };

    constructor(
            listResponseDto: ResponseDtos.DebtPayment.List,
            initialResponseDto: ResponseDtos.DebtPayment.Initial,
            requestDto?: RequestDtos.DebtPayment.List) {
        this.mapFromListResponseDto(listResponseDto);
        
        if (initialResponseDto) {
            const sortingOptions = initialResponseDto.listSortingOptions;
            const monthyearOptions = initialResponseDto.listMonthYearOptions;
            this.sortingOptions = new ListSortingOptionsModel(sortingOptions);
            this.sortingByField = this.sortingOptions.defaultFieldName;
            this.sortingByAscending = this.sortingOptions.defaultAscending;
            this.monthYearOptions = new ListMonthYearOptionsModel(monthyearOptions);
            this.canCreate = initialResponseDto.creatingPermission;
        }

        if (requestDto) {
            Object.assign(this, requestDto);
        }
    }

    public mapFromListResponseDto(responseDto: ResponseDtos.DebtPayment.List) {
        this.pageCount = responseDto.pageCount;
        this.items = responseDto.items?.map(dp => new DebtPaymentBasicModel(dp)) ?? [];
    }

    public toRequestDto(): RequestDtos.DebtPayment.List {
        return {
            sortingByAscending: this.sortingByAscending,
            sortingByField: this.sortingByField,
            monthYear: this.monthYear?.toRequestDto(),
            customerId: this.customerId,
            createdUserId: this.createdUserId,
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}

export class DebtPaymentDetailModel implements IDebtDetailModel<
        DebtPaymentUpdateHistoryModel, DebtPaymentExistingAuthorizationModel> {
    public readonly id: number;
    public readonly amount: number;
    public readonly note: string | null;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly createdUser: UserBasicModel;
    public readonly authorization: DebtPaymentExistingAuthorizationModel;
    public readonly updateHistories: DebtPaymentUpdateHistoryModel[];

    constructor(responseDto: ResponseDtos.DebtPayment.Detail) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.note = responseDto.note;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.isLocked = responseDto.isLocked;
        this.authorization = new DebtPaymentExistingAuthorizationModel(
            responseDto.authorization!);
        this.updateHistories = responseDto.updateHistories
            ?.map(uh => new DebtPaymentUpdateHistoryModel(uh))
            ?? [];
    }

    public get detailRoute(): RouteLocationRaw {
        return { name: "debtPaymentDetail", params: { debtPaymentId: this.id } };
    }

    public get updateRoute(): RouteLocationRaw {
        return { name: "debtPaymentUpdate", params: { debtPaymentId: this.id } };
    }
}

export class DebtPaymentUpsertModel implements IDebtUpsertModel {
    public id: number = 0;
    public amount: number = 0;
    public note: string = "";
    public customer: CustomerBasicModel | null = null;
    public statsDateTime: IStatsDateTimeInputModel;
    public updatedReason: string = "";
    public canSetStatsDateTime: boolean;
    public canDelete: boolean = false;

    constructor(canSetStatsDateTime: boolean);
    constructor(responseDto: ResponseDtos.DebtPayment.Detail)
    constructor(arg: boolean | ResponseDtos.DebtPayment.Detail) {
        if (typeof arg === "boolean") {
            this.statsDateTime = new StatsDateTimeInputModel(true);
            this.canSetStatsDateTime = arg;
        } else {
            this.id = arg.id;
            this.amount = arg.amount;
            this.note = arg.note ?? "";
            this.statsDateTime = new StatsDateTimeInputModel(false, arg.statsDateTime);
            this.customer = new CustomerBasicModel(arg.customer);
            this.canSetStatsDateTime = arg.authorization.canSetStatsDateTime;
            this.canDelete = arg.authorization.canDelete;
        }
    }
    
    public toRequestDto(): RequestDtos.DebtPayment.Upsert {
        return {
            amount: this.amount,
            note: this.note || null,
            statsDateTime: this.statsDateTime.toRequestDto(),
            customerId: this.customer?.id ?? 0,
            updatedReason: this.updatedReason || null
        };
    }
}

export class DebtPaymentCreatingAuthorizationModel
        implements IHasStatsCreatingAuthorizationModel {
    public canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.DebtIncurrence.CreatingAuthorization) {
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}

export class DebtPaymentExistingAuthorizationModel
        implements IHasStatsExistingAuthorizationModel{
    public canEdit: boolean = true;
    public canDelete: boolean = false;
    public canSetStatsDateTime: boolean;

    constructor(canSetStatsDateTime: boolean);
    constructor(responseDto: ResponseDtos.DebtPayment.ExistingAuthorization)
    constructor(arg: boolean | ResponseDtos.DebtPayment.ExistingAuthorization) {
        if (typeof arg === "boolean") {
            this.canSetStatsDateTime = arg;
        } else {
            this.canEdit = arg.canEdit;
            this.canDelete = arg.canDelete;
            this.canSetStatsDateTime = arg.canSetStatsDateTime;
        }
    }
}