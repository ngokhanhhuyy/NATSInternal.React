import { Gender, DebtOperationType } from "@enums";
import { useAvatarUtility } from "@/utilities/avatarUtility";
import { DateDisplayModel, DateInputModel, DateTimeDisplayModel } from "./dateTimeModels";
import { ListSortingOptionsModel } from "./listSortingModels";
import { UserBasicModel } from "./userModels";

const avatarUtility = useAvatarUtility();

export class CustomerBasicModel
        implements IUpsertableBasicModel<CustomerExistingAuthorizationModel> {
    public id: number;
    public fullName: string;
    public nickName: string | null;
    public gender: Gender = Gender.Male;
    public phoneNumber: string | null;
    public debtAmount: number;
    public avatarUrl: string;
    public authorization: CustomerExistingAuthorizationModel | null;

    constructor(responseDto: ResponseDtos.Customer.Basic) {
        this.id = responseDto.id;
        this.fullName = responseDto.fullName;
        this.nickName = responseDto.nickName;
        this.gender = responseDto.gender;
        this.phoneNumber = responseDto.phoneNumber;
        this.debtAmount = responseDto.debtAmount;
        this.authorization = responseDto.authorization &&
            new CustomerExistingAuthorizationModel(responseDto.authorization);
        this.avatarUrl = avatarUtility.getDefaultAvatarUrlByFullName(responseDto.fullName);
    }

    public get detailRoute(): RouteLocationRaw {
        return { name: "customerDetail", params: { customerId: this.id } };
    }

    public get updateRoute(): RouteLocationRaw {
        return { name: "customerUpdate", params: { customerId: this.id } };
    }
}

export class CustomerListModel implements ICreatorTrackableListModel<CustomerBasicModel> {
    public sortingByAscending: boolean | undefined;
    public sortingByField: string | undefined;
    public searchByContent: string = "";
    public createdUserId: number | undefined;
    public page: number = 1;
    public resultsPerPage: number = 15;
    public pageCount: number = 0;
    public items: CustomerBasicModel[] = [];
    public hasRemainingDebtAmountOnly: boolean = false;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: RouteLocationRaw = { name: "customerCreate" };

    constructor(
            listResponseDto: ResponseDtos.Customer.List,
            initialResponseDto?: ResponseDtos.Customer.Initial,
            requestDto?: RequestDtos.Customer.List) {
        this.mapFromListResponseDto(listResponseDto);
        
        if (initialResponseDto) {
            const sortingOptions = initialResponseDto.listSortingOptions;
            this.sortingOptions = new ListSortingOptionsModel(sortingOptions);
            this.sortingByField = this.sortingOptions.defaultFieldName;
            this.sortingByAscending = this.sortingOptions.defaultAscending;
            this.canCreate = initialResponseDto.creatingPermission;
        }

        if (requestDto) {
            Object.assign(this, requestDto);
        }
    }

    public mapFromListResponseDto(responseDto: ResponseDtos.Customer.List) {
        this.pageCount = responseDto.pageCount;
        this.items = responseDto.items?.map(dto => new CustomerBasicModel(dto)) ?? [];
    }

    public toRequestDto(): RequestDtos.Customer.List {
        return {
            sortingByField: this.sortingByField,
            sortingByAscending: this.sortingByAscending,
            searchByContent: this.searchByContent || undefined,
            createdUserId: this.createdUserId,
            page: this.page,
            resultsPerPage: this.resultsPerPage,
            hasRemainingDebtAmountOnly: this.hasRemainingDebtAmountOnly
        };
    }
}

export class CustomerDetailModel
        implements ICreatorTrackableDetailModel<CustomerExistingAuthorizationModel> {
    public id: number;
    public firstName: string;
    public middleName: string | null;
    public lastName: string;
    public fullName: string;
    public nickName: string | null;
    public gender: Gender;
    public birthday: DateDisplayModel | null;
    public phoneNumber: string | null;
    public zaloNumber: string | null;
    public facebookUrl: string | null;
    public email: string | null;
    public address: string | null;
    public note: string | null;
    public createdUser: UserBasicModel;
    public createdDateTime: DateTimeDisplayModel;
    public updatedDateTime: DateTimeDisplayModel | null;
    public introducer: CustomerBasicModel | null;
    public debtAmount: number;
    public debtOperations: CustomerDebtOperationModel[];
    public avatarUrl: string;
    public authorization: CustomerExistingAuthorizationModel;

    constructor(responseDto: ResponseDtos.Customer.Detail) {
        this.id = responseDto.id;
        this.firstName = responseDto.firstName;
        this.middleName = responseDto.middleName;
        this.lastName = responseDto.lastName;
        this.fullName = responseDto.fullName;
        this.nickName = responseDto.nickName;
        this.gender = responseDto.gender;
        this.birthday = responseDto.birthday
            ? new DateDisplayModel(responseDto.birthday)
            : null;
        this.phoneNumber = responseDto.phoneNumber;
        this.zaloNumber = responseDto.zaloNumber;
        this.facebookUrl = responseDto.facebookUrl;
        this.email = responseDto.email;
        this.address = responseDto.address;
        this.note = responseDto.note;
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.updatedDateTime = responseDto.updatedDateTime
            ? new DateTimeDisplayModel(responseDto.updatedDateTime)
            : null;
        this.introducer = responseDto.introducer &&
            new CustomerBasicModel(responseDto.introducer);
        this.debtAmount = responseDto.debtAmount;
        this.debtOperations = (responseDto.debtOperations ?? [])
            .map(dh => new CustomerDebtOperationModel(dh));
        this.authorization = new CustomerExistingAuthorizationModel(responseDto.authorization);
        this.avatarUrl = avatarUtility.getDefaultAvatarUrlByFullName(responseDto.fullName);
    }

    public get detailRoute(): RouteLocationRaw {
        return { name: "customerDetail", params: { customerId: this.id } };
    }

    public get updateRoute(): RouteLocationRaw {
        return { name: "customerUpdate", params: { customerId: this.id } };
    }
}

export class CustomerUpsertModel {
    public id: number = 0;
    public firstName: string = "";
    public middleName: string = "";
    public lastName: string = "";
    public nickName: string = "";
    public gender: Gender = Gender.Male;
    public birthday: DateInputModel = new DateInputModel();
    public phoneNumber: string = "";
    public zaloNumber: string = "";
    public facebookUrl: string = "";
    public email: string = "";
    public address: string = "";
    public note: string = "";
    public introducerId: number | null = null;

    constructor(responseDto?: ResponseDtos.Customer.Detail) {
        if (responseDto) {
            this.id = responseDto.id;
            this.firstName = responseDto.firstName;
            this.middleName = responseDto.middleName || "";
            this.lastName = responseDto.lastName;
            this.nickName = responseDto.nickName || "";
            this.gender = responseDto.gender;
            this.phoneNumber = responseDto.phoneNumber || "";
            this.zaloNumber = responseDto.zaloNumber || "";
            this.facebookUrl = responseDto.facebookUrl || "";
            this.email = responseDto.email || "";
            this.address = responseDto.address || "";
            this.note = responseDto.note || "";
            if (responseDto.birthday) {
                this.birthday.inputDate = responseDto.birthday;
            }
        }
    }

    public toRequestDto(): RequestDtos.Customer.Upsert {
        return {
            firstName: this.firstName || null,
            middleName: this.middleName || null,
            lastName: this.lastName || null,
            nickName: this.nickName || null,
            gender: this.gender,
            birthday: this.birthday.toRequestDto(),
            phoneNumber: this.phoneNumber || null,
            zaloNumber: this.zaloNumber || null,
            facebookUrl: this.facebookUrl || null,
            email: this.email || null,
            address: this.address || null,
            note: this.note || null,
            introducerId: this.introducerId
        };
    }
}

export class CustomerExistingAuthorizationModel
        implements IUpsertableExistingAuthorizationModel {
    public canEdit: boolean;
    public canDelete: boolean;

    constructor(responseDto: ResponseDtos.Customer.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
    }
}

export class CustomerDebtOperationModel {
    public operation: DebtOperationType;
    public amount: number;
    public operatedDateTime: DateTimeDisplayModel;
    public isLocked: boolean;
    public authorization: ResponseDtos.Customer.DebtOperationAuthorization;

    constructor(responseDto: ResponseDtos.Customer.DebtOperation) {
        this.operation = responseDto.operation;
        this.amount = responseDto.amount;
        this.operatedDateTime = new DateTimeDisplayModel(responseDto.operatedDateTime);
        this.isLocked = responseDto.isLocked;
        this.authorization = new CustomerDebtOperationAuthorizationModel(
            responseDto.authorization);
    }
}

export class CustomerDebtOperationAuthorizationModel {
    public canEdit: boolean;
    public canDelete: boolean;

    constructor(responseDto: ResponseDtos.Customer.DebtOperationAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
    }
}

export class CustomerNewStatsModel {
    public thisMonthCount: number;
    public percentageComparedToLastMonth: number;

    constructor(responseDto: ResponseDtos.Customer.NewStats) {
        this.thisMonthCount = responseDto.thisMonthCount;
        this.percentageComparedToLastMonth = responseDto.percentageComparedToLastMonth;
    }
}