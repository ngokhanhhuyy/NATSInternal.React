import type { RouteLocationRaw } from "vue-router";
import { DebtIncurrenceUpdateHistoryModel } from "./debtIncurrenceUpdateHistoryModels";
import { CustomerBasicModel } from "./customerModels";
import { UserBasicModel } from "./userModels";
import { ListMonthYearOptionsModel, ListMonthYearModel } from "./listMonthYearModels";
import { ListSortingOptionsModel } from "./listSortingModels";
import { DateTimeDisplayModel, StatsDateTimeInputModel } from "./dateTimeModels";

export class DebtIncurrenceBasicModel
        implements IDebtBasicModel<DebtIncurrenceExistingAuthorizationModel> {
    public readonly id: number;
    public readonly amount: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly authorization: DebtIncurrenceExistingAuthorizationModel | null;

    constructor(responseDto: ResponseDtos.DebtIncurrence.Basic) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.authorization = responseDto.authorization &&
            new DebtIncurrenceExistingAuthorizationModel(responseDto.authorization);
    }

    public get detailRoute(): RouteLocationRaw {
        return { name: "debtIncurrenceDetail", params: { debtIncurrenceId: this.id } };
    }

    public get updateRoute(): RouteLocationRaw {
        return { name: "debtIncurrenceUpdate", params: { debtIncurrenceId: this.id } };
    }
}

export class DebtIncurrenceListModel implements IDebtListModel<
        DebtIncurrenceBasicModel, DebtIncurrenceExistingAuthorizationModel>  {
    public sortingByAscending: boolean | undefined;
    public sortingByField: string | undefined;
    public monthYear: ListMonthYearModel | undefined;
    public customerId: number | undefined;
    public createdUserId: number | undefined;
    public page: number = 1;
    public resultsPerPage: number = 15;
    public items: DebtIncurrenceBasicModel[] = [];
    public pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: RouteLocationRaw = { name: "home" };

    constructor(
            listResponseDto: ResponseDtos.DebtIncurrence.List,
            initialResponseDto: ResponseDtos.DebtIncurrence.Initial,
            requestDto?: RequestDtos.DebtIncurrence.List) {
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

    public mapFromListResponseDto(responseDto: ResponseDtos.DebtIncurrence.List): void {
        this.pageCount = responseDto.pageCount;
        this.items = responseDto.items?.map(i => new DebtIncurrenceBasicModel(i)) ?? [];
    }

    public toRequestDto(): RequestDtos.DebtIncurrence.List {
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

export class DebtIncurrenceDetailModel implements IDebtDetailModel<
        DebtIncurrenceUpdateHistoryModel, DebtIncurrenceExistingAuthorizationModel> {
    public id: number;
    public amount: number;
    public note: string | null;
    public statsDateTime: DateTimeDisplayModel;
    public createdDateTime: DateTimeDisplayModel;
    public isLocked: boolean;
    public customer: CustomerBasicModel;
    public createdUser: UserBasicModel;
    public authorization: DebtIncurrenceExistingAuthorizationModel;
    public updateHistories: DebtIncurrenceUpdateHistoryModel[];

    constructor(responseDto: ResponseDtos.DebtIncurrence.Detail) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.note = responseDto.note;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.authorization = new DebtIncurrenceExistingAuthorizationModel(
            responseDto.authorization);
        this.updateHistories = responseDto.updateHistories
            ?.map(uh => new DebtIncurrenceUpdateHistoryModel(uh))
            ?? [];
    }

    public get detailRoute(): RouteLocationRaw {
        return { name: "debtIncurrenceDetail", params: { debtIncurrenceId: this.id } };
    }

    public get updateRoute(): RouteLocationRaw {
        return { name: "debtIncurrenceUpdate", params: { debtIncurrenceId: this.id } };
    }
}

export class DebtIncurrenceUpsertModel implements IDebtUpsertModel {
    public id: number = 0;
    public amount: number = 0;
    public note: string = "";
    public statsDateTime: IStatsDateTimeInputModel;
    public customer: CustomerBasicModel | null = null;
    public updatedReason: string = "";
    public canSetStatsDateTime: boolean;
    public canDelete: boolean = false;

    constructor(canSetStatsDateTime: boolean);
    constructor(responseDto: ResponseDtos.DebtIncurrence.Detail)
    constructor(arg: boolean | ResponseDtos.DebtIncurrence.Detail) {
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
    
    public toRequestDto(): RequestDtos.DebtIncurrence.Upsert {
        return {
            amount: this.amount,
            note: this.note,
            statsDateTime: this.statsDateTime.toRequestDto(),
            customerId: this.customer?.id ?? null,
            updatedReason: this.updatedReason || null
        };
    }
}

export class DebtIncurrenceCreatingAuthorizationModel
        implements IHasStatsCreatingAuthorizationModel {
    public canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.DebtIncurrence.CreatingAuthorization) {
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}

export class DebtIncurrenceExistingAuthorizationModel
        implements IHasStatsExistingAuthorizationModel {
    public canEdit: boolean = true;
    public canDelete: boolean = false;
    public canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.DebtIncurrence.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}