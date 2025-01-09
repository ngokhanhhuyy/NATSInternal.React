import type { RouteLocationRaw } from "vue-router";
import { OrderDetailItemModel, OrderUpsertItemModel } from "./orderItemModels";
import { OrderDetailPhotoModel, OrderUpsertPhotoModel } from "./orderPhotoModels";
import {
    OrderItemUpdateHistoryModel,
    OrderUpdateHistoryModel } from "./orderUpdateHistoryModels";
import { CustomerBasicModel } from "./customerModels";
import { UserBasicModel } from "./userModels";
import { ListSortingOptionsModel } from "./listSortingModels";
import { ListMonthYearOptionsModel, ListMonthYearModel } from "./listMonthYearModels";
import { DateTimeDisplayModel, StatsDateTimeInputModel } from "./dateTimeModels";

export class OrderBasicModel implements IHasStatsBasicModel<OrderExistingAuthorizationModel> {
    public readonly id: number; 
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly amount: number;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly authorization: OrderExistingAuthorizationModel | null;
    public readonly detailRoute: RouteLocationRaw;
    public readonly updateRoute: RouteLocationRaw;

    constructor(responseDto: ResponseDtos.Order.Basic) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.amount = responseDto.amount;
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.authorization = responseDto.authorization &&
            new OrderExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = { name: "orderDetail", params: { orderId: this.id } };
        this.updateRoute = { name: "orderUpdate", params: { orderId: this.id } };
    }
}

export class OrderListModel implements IExportProductListModel<
        OrderBasicModel,
        OrderExistingAuthorizationModel> {
    public sortingByAscending: boolean | undefined;
    public sortingByField: string | undefined;
    public monthYear: ListMonthYearModel | undefined;
    public createdUserId: number | undefined;
    public customerId: number | undefined;
    public productId: number | undefined;
    public page: number = 1;
    public resultsPerPage: number = 15;
    public items: OrderBasicModel[] = [];
    public pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: RouteLocationRaw = { name: "orderCreate" };

    constructor(
            responseDto: ResponseDtos.Order.List,
            initialResponseDto?: ResponseDtos.Order.Initial,
            requestDto?: RequestDtos.Order.List) {
        this.mapFromListResponseDto(responseDto);
        
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

    public mapFromListResponseDto(responseDto: ResponseDtos.Order.List): void {
        this.pageCount = responseDto.pageCount;
        this.items = responseDto.items?.map(i => new OrderBasicModel(i)) ?? [];
    }

    public toRequestDto(): RequestDtos.Order.List {
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

export class OrderDetailModel implements IExportProductDetailModel<
        OrderDetailItemModel,
        OrderUpdateHistoryModel,
        OrderItemUpdateHistoryModel,
        OrderExistingAuthorizationModel> {
    public readonly id: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly amountBeforeVat: number;
    public readonly vatAmount: number;
    public readonly note: string;
    public readonly isLocked: boolean;
    public readonly items: OrderDetailItemModel[];
    public readonly customer: CustomerBasicModel;
    public readonly createdUser: UserBasicModel;
    public readonly photos: OrderDetailPhotoModel[];
    public readonly updateHistories: OrderUpdateHistoryModel[];
    public readonly authorization: OrderExistingAuthorizationModel;
    public readonly detailRoute: RouteLocationRaw;
    public readonly updateRoute: RouteLocationRaw;

    constructor(responseDto: ResponseDtos.Order.Detail) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.amountBeforeVat = responseDto.amountBeforeVat;
        this.vatAmount = responseDto.vatAmount;
        this.note = responseDto.note;
        this.isLocked = responseDto.isLocked;
        this.items = responseDto.items?.map(i => new OrderDetailItemModel(i)) ?? [];
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.photos = responseDto.photos?.map(p => new OrderDetailPhotoModel(p)) ?? [];
        this.updateHistories = responseDto.updateHistories
            ?.map(uh => new OrderUpdateHistoryModel(uh)) ?? [];
        this.authorization = new OrderExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = { name: "orderDetail", params: { orderId: this.id } };
        this.updateRoute = { name: "orderUpdate", params: { orderId: this.id } };
    }

    public get productAmountBeforeVat(): number {
        let amount: number = 0;
        this.items.forEach(i => amount += i.productAmountPerUnit * i.quantity);
        return amount;
    }

    public get productVatAmount(): number {
        let amount: number = 0;
        this.items.forEach(i => amount+= i.vatAmountPerUnit * i.quantity);
        return amount;
    }

    public get amountAfterVat(): number {
        return this.productAmountBeforeVat + this.productVatAmount;
    }
}

export class OrderUpsertModel implements IExportProductUpsertModel<
        OrderUpsertItemModel,
        OrderUpsertPhotoModel> {
    public id: number = 0;
    public statsDateTime: IStatsDateTimeInputModel;
    public note: string = "";
    public customer: CustomerBasicModel | null = null;
    public items: OrderUpsertItemModel[] = [];
    public photos: OrderUpsertPhotoModel[] = [];
    public updatedReason: string = "";

    constructor(responseDto?: ResponseDtos.Order.Detail) {
        this.id = responseDto.id;
        this.statsDateTime = new StatsDateTimeInputModel(false, responseDto.statsDateTime);
        this.note = responseDto.note ?? "";
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.items = responseDto.items?.map(i => new OrderUpsertItemModel(i)) ?? [];
        this.photos = responseDto.photos?.map(p => new OrderUpsertPhotoModel(p)) ?? [];
    }

    public get productAmountBeforeVat(): number {
        return this.items.reduce(
            (amount, item) => amount + item.productAmountPerUnit * item.quantity, 0);
    }

    public get productVatAmount(): number {
        return this.items.reduce(
            (amount, item) => amount + item.vatAmountPerUnit * item.quantity, 0);
    }

    public get productAmountAfterVat(): number  {
        return this.amountBeforeVat + this.productVatAmount;
    }

    public get amountBeforeVat(): number {
        return this.productAmountBeforeVat;
    }

    public get vatAmount(): number {
        return this.productVatAmount;
    }

    public get amountAfterVat(): number {
        return this.productAmountAfterVat;
    }

    public toRequestDto(): RequestDtos.Order.Upsert {
        return {
            statsDateTime: this.statsDateTime.toRequestDto(),
            note: this.note || null,
            customerId: (this.customer && this.customer.id) ?? 0,
            items: this.items.map(i => i.toRequestDto()),
            photos: this.photos.map(p => p.toRequestDto()),
            updatedReason: this.updatedReason || null
        };
    }
}

export class OrderExistingAuthorizationModel implements IHasStatsExistingAuthorizationModel {
    public readonly canEdit: boolean = true;
    public readonly canDelete: boolean = false;
    public readonly canSetStatsDateTime: boolean;
    constructor(responseDto: ResponseDtos.Order.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}

export class OrderCreatingAuthorizationModel implements IHasStatsCreatingAuthorizationModel {
    public readonly canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.Order.ExistingAuthorization) {
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}