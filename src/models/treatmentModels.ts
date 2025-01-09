import type { RouteLocationRaw } from "vue-router";
import { TreatmentDetailItemModel, TreatmentUpsertItemModel } from "./treatmentItemModels";
import { TreatmentDetailPhotoModel, TreatmentUpsertPhotoModel } from "./treatmentPhotoModels";
import {
    TreatmentItemUpdateHistoryModel,
    TreatmentUpdateHistoryModel } from "./treatmentUpdateHistoryModels";
import { CustomerBasicModel } from "./customerModels";
import { UserBasicModel } from "./userModels";
import { ListSortingOptionsModel } from "./listSortingModels";
import { ListMonthYearOptionsModel, ListMonthYearModel } from "./listMonthYearModels";
import { DateTimeDisplayModel, StatsDateTimeInputModel } from "./dateTimeModels";

type ListRequestDto = RequestDtos.Treatment.List;
type ListResponseDto = ResponseDtos.Treatment.List;
type ListSortingOptionsResponseDto = ResponseDtos.List.SortingOptions;
type ListMonthYearOptionsResponseDto = ResponseDtos.List.MonthYearOptions;

export class TreatmentBasicModel implements
        IHasStatsBasicModel<TreatmentExistingAuthorizationModel> {
    public readonly id: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly amount: number;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly authorization: TreatmentExistingAuthorizationModel | null;
    public readonly detailRoute: RouteLocationRaw;
    public readonly updateRoute: RouteLocationRaw;

    constructor(responseDto: ResponseDtos.Treatment.Basic) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.amount = responseDto.amount;
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.authorization = responseDto.authorization &&
            new TreatmentExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = { name: "treatmentDetail", params: { treatmentId: this.id } };
        this.updateRoute = { name: "treatmentUpdate", params: { treatmentId: this.id } };
    }
}

export class TreatmentListModel implements IExportProductListModel<
        TreatmentBasicModel, TreatmentExistingAuthorizationModel> {
    public sortingByAscending: boolean | undefined;
    public sortingByField: string | undefined;
    public monthYear: ListMonthYearModel | undefined;
    public createdUserId: number | undefined;
    public productId: number | undefined;
    public customerId: number | undefined;
    public page: number = 1;
    public resultsPerPage: number = 15;
    public items: TreatmentBasicModel[] = [];
    public pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: RouteLocationRaw = { name: "treatmentCreate" };

    constructor(
            listResponseDto: ResponseDtos.Treatment.List,
            initialResponseDto?: ResponseDtos.Treatment.Initial,
            requestDto?: RequestDtos.Treatment.List) {
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

    public mapFromListResponseDto(responseDto: ListResponseDto) {
        this.pageCount = responseDto.pageCount;
        this.items = (responseDto.items ?? []).map(i => new TreatmentBasicModel(i));
    }

    public toRequestDto(): RequestDtos.Treatment.List {
        return {
            sortingByAscending: this.sortingByAscending,
            sortingByField: this.sortingByField,
            monthYear: this.monthYear?.toRequestDto(),
            createdUserId: this.createdUserId,
            productId: this.productId,
            customerId: this.customerId,
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}

export class TreatmentDetailModel implements IExportProductDetailModel<
        TreatmentDetailItemModel,
        TreatmentUpdateHistoryModel,
        TreatmentItemUpdateHistoryModel,
        TreatmentExistingAuthorizationModel> {
    public readonly id: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly serviceAmountBeforeVat: number;
    public readonly serviceVatAmount: number;
    public readonly note: string | null;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly createdUser: UserBasicModel;
    public readonly therapist: UserBasicModel | null;
    public readonly items: TreatmentDetailItemModel[];
    public readonly photos: TreatmentDetailPhotoModel[];
    public readonly updateHistories: TreatmentUpdateHistoryModel[];
    public readonly authorization: TreatmentExistingAuthorizationModel;
    public readonly detailRoute: RouteLocationRaw;
    public readonly updateRoute: RouteLocationRaw;

    constructor(responseDto: ResponseDtos.Treatment.Detail) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.serviceAmountBeforeVat = responseDto.serviceAmountBeforeVat;
        this.serviceVatAmount = responseDto.serviceVatAmount;
        this.note = responseDto.note;
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.therapist = responseDto.therapist && new UserBasicModel(responseDto.therapist);
        this.items = responseDto.items?.map(i => new TreatmentDetailItemModel(i)) ?? [];
        this.photos = responseDto.photos?.map(p => new TreatmentDetailPhotoModel(p)) ?? [];
        this.authorization = new TreatmentExistingAuthorizationModel(
            responseDto.authorization);
        this.updateHistories = responseDto.updateHistories
            ?.map(uh => new TreatmentUpdateHistoryModel(uh)) ?? [];
        this.detailRoute = { name: "treatmentDetail", params: { treatmentId: this.id } };
        this.updateRoute = { name: "treatmentUpdate", params: { treatmentId: this.id } };
    }

    public get productAmountBeforeVat(): number {
        let amount: number = 0;
        for (const item of this.items) {
            amount += item.productAmountPerUnit * item.quantity;
        }

        return amount;
    }

    public get productVatAmount(): number {
        let amount: number = 0;
        for (const item of this.items) {
            amount+= item.vatAmountPerUnit * item.quantity;
        }

        return amount;
    }

    public get amountBeforeVat(): number {
        return this.productAmountBeforeVat + this.serviceAmountBeforeVat;
    }

    public get vatAmount(): number {
        return this.serviceVatAmount + this.productVatAmount;
    }

    public get amountAfterVat(): number {
        return this.productAmountBeforeVat + this.productVatAmount +
            this.serviceAmountBeforeVat + this.serviceVatAmount;
    }
}

export class TreatmentUpsertModel implements IExportProductUpsertModel<
        TreatmentUpsertItemModel,
        TreatmentUpsertPhotoModel> {
    public id: number = 0;
    public statsDateTime: IStatsDateTimeInputModel;
    public serviceAmountBeforeVat: number = 0;
    public serviceVatPercentage: number = 0;
    public note: string = "";
    public customer: CustomerBasicModel | null = null;
    public therapist: UserBasicModel | null = null;
    public items: TreatmentUpsertItemModel[] = [];
    public photos: TreatmentUpsertPhotoModel[] = [];
    public updatedReason: string = "";

    constructor(responseDto: ResponseDtos.Treatment.Detail) {
        this.id = responseDto.id;
        this.statsDateTime = new StatsDateTimeInputModel(false, responseDto.statsDateTime);
        this.serviceAmountBeforeVat = responseDto.serviceAmountBeforeVat;
        this.serviceVatPercentage = responseDto.serviceVatAmount /
            responseDto.serviceAmountBeforeVat * 100;
        this.note = responseDto.note ?? "";
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.therapist = responseDto.therapist && new UserBasicModel(responseDto.therapist);
        this.items = responseDto.items?.map(i => new TreatmentUpsertItemModel(i));
        this.photos = responseDto.photos?.map(p => new TreatmentUpsertPhotoModel(p));
    }

    public get productAmountBeforeVat(): number {
        return this.items.reduce(
            (amount, item) => amount + (item.productAmountPerUnit * item.quantity), 0);
    }

    public get productVatAmount(): number {
        return this.items.reduce(
            (amount, item) => amount + (item.vatAmountPerUnit * item.quantity), 0);
    }

    public get productAmountAfterVat(): number  {
        return this.productAmountBeforeVat + this.productVatAmount;
    }

    public get serviceVatAmount(): number {
        return this.serviceAmountBeforeVat * (this.serviceVatPercentage / 100);
    }

    public get serviceAmountAfterVat(): number {
        return this.serviceAmountBeforeVat + this.serviceVatAmount;
    }

    public get amountBeforeVat(): number {
        return this.productAmountBeforeVat + this.serviceAmountBeforeVat;
    }

    public get vatAmount(): number {
        return this.serviceVatAmount + this.productVatAmount;
    }

    public get amountAfterVat(): number {
        return this.productAmountBeforeVat + this.serviceAmountBeforeVat + this.vatAmount;
    }
    
    public toRequestDto(): RequestDtos.Treatment.Upsert {
        return {
            statsDateTime: this.statsDateTime.toString(),
            serviceAmountBeforeVat: this.serviceAmountBeforeVat,
            serviceVatFactor: this.serviceVatPercentage / 100,
            note: this.note || null,
            customerId: this.customer?.id ?? null,
            therapistId: this.therapist?.id ?? null,
            updatedReason: this.updatedReason || null,
            items: this.items.map(i => i.toRequestDto()),
            photos: this.photos.map(p => p.toRequestDto())
        };
    }
}

export class TreatmentCreatingAuthorizationModel
        implements IHasStatsCreatingAuthorizationModel {
    public readonly canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.Treatment.ExistingAuthorization) {
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}

export class TreatmentExistingAuthorizationModel
        implements IHasStatsExistingAuthorizationModel {
    public readonly canEdit: boolean = true;
    public readonly canDelete: boolean = false;
    public readonly canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.Treatment.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}