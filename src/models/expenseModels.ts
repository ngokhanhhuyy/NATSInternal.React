import { ExpenseCategory } from "@enums";
import { ExpenseDetailPhotoModel, ExpenseUpsertPhotoModel } from "./expensePhotoModels";
import { ExpenseUpdateHistoryModel } from "./expenseUpdateHistoryModels";
import { UserBasicModel } from "./userModels";
import { ListMonthYearModel } from "./listMonthYearModels";
import { DateTimeDisplayModel, StatsDateTimeInputModel } from "./dateTimeModels";
import { ListSortingOptionsModel } from "./listSortingModels";
import { ListMonthYearOptionsModel } from "./listMonthYearModels";
import { usePhotoUtility } from "@/utilities/photoUtility";

const photoUtility = usePhotoUtility();

export class ExpenseBasicModel implements
        IHasStatsBasicModel<ExpenseExistingAuthorizationModel>,
        IHasPhotoBasicModel {
    public id: number;
    public amount: number;
    public statsDateTime: DateTimeDisplayModel;
    public category: ExpenseCategory;
    public isLocked: boolean;
    public thumbnailUrl: string;
    public authorization: ExpenseExistingAuthorizationModel | null;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Expense.Basic) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.category = responseDto.category;
        this.isLocked = responseDto.isLocked;
        this.thumbnailUrl = responseDto.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
        this.authorization = responseDto.authorization &&
            new ExpenseExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = "";
        this.updateRoute = "";
    }
}

export class ExpenseListModel implements IHasStatsListModel<
        ExpenseBasicModel,
        ExpenseExistingAuthorizationModel>  {
    public sortingByAscending: boolean | undefined;
    public sortingByField: string | undefined;
    public monthYear: ListMonthYearModel | undefined;
    public category: ExpenseCategory | undefined;
    public createdUserId: number | undefined;
    public page: number = 1;
    public resultsPerPage: number = 15;
    public items: ExpenseBasicModel[] = [];
    public pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string = { name: "expenseCreate" };

    constructor(
            listResponseDto: ResponseDtos.Expense.List,
            initialResponseDto?: ResponseDtos.Expense.Initial,
            requestDto?: RequestDtos.Expense.List) {
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

    public mapFromListResponseDto(responseDto: ResponseDtos.Expense.List): void {
        this.items = responseDto.items?.map(i => new ExpenseBasicModel(i)) || [];
        this.pageCount = responseDto.pageCount;
    }

    public toRequestDto(): RequestDtos.Expense.List {
        return {
            sortingByAscending: this.sortingByAscending,
            sortingByField: this.sortingByField,
            monthYear: this.monthYear?.toRequestDto(),
            createdUserId: this.createdUserId,
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}

export class ExpenseDetailModel implements
        IHasStatsDetailModel<ExpenseUpdateHistoryModel, ExpenseExistingAuthorizationModel>,
        IHasMultiplePhotoDetailModel<ExpenseDetailPhotoModel> {
    public id: number;
    public amountAfterVat: number;
    public statsDateTime: DateTimeDisplayModel;
    public createdDateTime: DateTimeDisplayModel;
    public category: ExpenseCategory;
    public note: string;
    public isLocked: boolean;
    public createdUser: UserBasicModel;
    public payeeName: string;
    public photos: ExpenseDetailPhotoModel[];
    public authorization: ExpenseExistingAuthorizationModel;
    public updateHistories: ExpenseUpdateHistoryModel[] | null;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Expense.Detail) {
        this.id = responseDto.id;
        this.amountAfterVat = responseDto.amountAfterVat;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.category = responseDto.category;
        this.note = responseDto.note ?? "";
        this.isLocked = responseDto.isLocked;
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.payeeName = responseDto.payee.name;
        this.photos = responseDto.photos?.map(p => new ExpenseDetailPhotoModel(p)) ?? [];
        this.authorization = new ExpenseExistingAuthorizationModel(responseDto.authorization);
        this.updateHistories = responseDto.updateHistories &&
            responseDto.updateHistories.map(uh => new ExpenseUpdateHistoryModel(uh));
        this.detailRoute = "";
        this.updateRoute = "";
    }
}

export class ExpenseUpsertModel implements
        IHasStatsUpsertModel,
        IHasMultiplePhotoUpsertModel<ExpenseUpsertPhotoModel> {
    public id: number = 0;
    public amount: number = 0;
    public statsDateTime: IStatsDateTimeInputModel;
    public category: ExpenseCategory = ExpenseCategory.Equipment;
    public note: string = "";
    public payeeName: string = "";
    public photos: ExpenseUpsertPhotoModel[] = [];
    public updatedReason: string = "";
    public readonly canSetStatsDateTime: boolean | undefined;
    public readonly canDelete: boolean | undefined;

    constructor(canSetStatsDateTime: boolean, canDelete: boolean);
    constructor(responseDto: ResponseDtos.Expense.Detail);
    constructor(arg: ResponseDtos.Expense.Detail | boolean, canDelete?: boolean) {
        if (typeof arg === "boolean") {
            this.statsDateTime = new StatsDateTimeInputModel(true);
            this.canSetStatsDateTime = arg;
            this.canDelete = canDelete;
        } else {
            this.amount = arg.amountAfterVat;
            this.statsDateTime = new StatsDateTimeInputModel(false, arg.statsDateTime);
            this.category = arg.category;
            this.note = arg.note ?? "";
            this.payeeName = arg.payee.name;
            this.photos = arg.photos?.map(p => new ExpenseUpsertPhotoModel(p)) ?? [];
            this.canSetStatsDateTime = arg.authorization.canSetStatsDateTime;
            this.canDelete = arg.authorization.canDelete;
        }
    }

    public toRequestDto(): RequestDtos.Expense.Upsert {
        return {
            amount: this.amount,
            statsDateTime: this.statsDateTime.toRequestDto(),
            category: this.category,
            note: this.note || null,
            payeeName: this.payeeName,
            photos: this.photos.length ? this.photos.map(p => p.toRequestDto()) : null,
            updatedReason: this.updatedReason || null
        };
    }
}

export class ExpenseExistingAuthorizationModel implements IHasStatsExistingAuthorizationModel {
    public canEdit: boolean = true;
    public canDelete: boolean = false;
    public canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.Expense.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}

export class ExpenseCreatingAuthorizationModel implements IHasStatsCreatingAuthorizationModel {
    public canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.Expense.ExistingAuthorization) {
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}