// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { RouteLocationRaw } from "vue-router";
import { SupplyDetailItemModel, SupplyUpsertItemModel } from "./supplyItemModels";
import { SupplyDetailPhotoModel, SupplyUpsertPhotoModel } from "./supplyPhotoModels";
import { SupplyItemUpdateHistoryModel, SupplyUpdateHistoryModel } from "./supplyUpdateHistoryModels";
import { UserBasicModel } from "./userModels";
import { ListMonthYearModel, ListMonthYearOptionsModel } from "./listMonthYearModels";
import { DateTimeDisplayModel, StatsDateTimeInputModel } from "./dateTimeModels";
import { ListSortingOptionsModel } from "./listSortingModels";
import { usePhotoUtility } from "@/utilities/photoUtility";

type ListSortingOptionsResponseDto = ResponseDtos.List.SortingOptions;
type ListMonthYearOptionsResponseDto = ResponseDtos.List.MonthYearOptions;

const photoUtility = usePhotoUtility();

export class SupplyBasicModel implements
        IHasStatsBasicModel<SupplyExistingAuthorizationModel>,
        IHasPhotoBasicModel {
    public readonly id: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly amount: number;
    public readonly isLocked: boolean;
    public readonly user: UserBasicModel;
    public readonly thumbnailUrl: string;
    public readonly authorization: SupplyExistingAuthorizationModel | null;
    public readonly detailRoute: RouteLocationRaw;
    public readonly updateRoute: RouteLocationRaw;
    
    constructor(responseDto: ResponseDtos.Supply.Basic) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.amount = responseDto.amount;
        this.isLocked = responseDto.isLocked;
        this.user = new UserBasicModel(responseDto.createdUser);
        this.thumbnailUrl = responseDto.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
        this.authorization = responseDto.authorization &&
            new SupplyExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = { name: "supplyDetail", params: { supplyId: this.id } };
        this.updateRoute = { name: "supplyUpdate", params: { supplyId: this.id } };
    }
}

export class SupplyListModel
        implements IHasProductListModel<SupplyBasicModel, SupplyExistingAuthorizationModel> {
    public sortingByAscending: boolean | undefined;
    public sortingByField: string | undefined;
    public monthYear: ListMonthYearModel | undefined;
    public createdUserId: number | undefined;
    public productId: number | undefined;
    public page: number = 1;
    public resultsPerPage: number = 15;
    public items: SupplyBasicModel[] = [];
    public pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: RouteLocationRaw = { name: "supplyCreate" };

    constructor(
            listResponseDto: ResponseDtos.Supply.List,
            initialResponseDto?: ResponseDtos.Supply.Initial,
            requestDto?: RequestDtos.Supply.List) {
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

    public mapFromListResponseDto(responseDto: ResponseDtos.Supply.List) {
        this.pageCount = responseDto.pageCount;
        this.items = (responseDto.items ?? []).map(dto => new SupplyBasicModel(dto));
    }

    public toRequestDto(): RequestDtos.Supply.List {
        return {
            sortingByAscending: this.sortingByAscending,
            sortingByField: this.sortingByField,
            monthYear: this.monthYear?.toRequestDto(),
            createdUserId: this.createdUserId,
            productId: this.productId,
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}

export class SupplyDetailModel implements IHasProductDetailModel<
        SupplyDetailItemModel,
        SupplyUpdateHistoryModel,
        SupplyItemUpdateHistoryModel,
        SupplyExistingAuthorizationModel> {
    public readonly id: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly shipmentFee: number;
    public readonly note: string | null;
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly isLocked: boolean;
    public readonly items: SupplyDetailItemModel[];
    public readonly photos: SupplyDetailPhotoModel[];
    public readonly createdUser: UserBasicModel;
    public readonly updateHistories: SupplyUpdateHistoryModel[];
    public readonly authorization: SupplyExistingAuthorizationModel;
    public readonly detailRoute: RouteLocationRaw;
    public readonly updateRoute: RouteLocationRaw;

    constructor(responseDto: ResponseDtos.Supply.Detail) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.shipmentFee = responseDto.shipmentFee;
        this.note = responseDto.note;
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.isLocked = responseDto.isLocked;
        this.items = responseDto.items?.map(dto => new SupplyDetailItemModel(dto)) || [];
        this.photos = responseDto.photos?.map(dto => new SupplyDetailPhotoModel(dto)) || [];
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.authorization = new SupplyExistingAuthorizationModel(responseDto.authorization);
        this.updateHistories = responseDto.updateHistories
            ?.map(uh => new SupplyUpdateHistoryModel(uh)) ?? [];
        this.detailRoute = { name: "supplyDetail", params: { supplyId: this.id } };
        this.updateRoute = { name: "supplyUpdate", params: { supplyId: this.id } };
    }

    public get amount(): number {
        return this.items.reduce((amount, item) => amount + item.productAmount, 0);
    }

    public get lastUpdatedDateTime(): DateTimeDisplayModel | null {
        if (this.updateHistories && this.updateHistories.length) {
            return this.updateHistories[this.updateHistories.length].updatedDateTime;
        }

        return null;
    }
}

export class SupplyUpsertModel
        implements IHasProductUpsertModel<SupplyUpsertItemModel, SupplyUpsertPhotoModel> {
    public id: number = 0;
    public statsDateTime: IStatsDateTimeInputModel;
    public shipmentFee: number = 0;
    public note: string = "";
    public items: SupplyUpsertItemModel[] = [];
    public photos: SupplyUpsertPhotoModel[] = [];
    public updatedReason: string = "";

    constructor(responseDto?: ResponseDtos.Supply.Detail) {
        if (!responseDto) {
            this.statsDateTime = new StatsDateTimeInputModel(true);
        } else {
            this.id = responseDto.id;
            this.statsDateTime = new StatsDateTimeInputModel(false, responseDto.statsDateTime);
            this.shipmentFee = responseDto.shipmentFee;
            this.note = responseDto.note || "";
            this.items = responseDto.items?.map(dto => new SupplyUpsertItemModel(dto)) || [];
            this.photos = responseDto.photos?.map(dto => new SupplyUpsertPhotoModel(dto)) || [];
        }
    }

    public toRequestDto(): RequestDtos.Supply.Upsert {
        return {
            statsDateTime: this.statsDateTime.toRequestDto(),
            shipmentFee: this.shipmentFee,
            note: this.note || null,
            updatedReason: this.updatedReason || null,
            items: this.items.map(i => i.toRequestDto()),
            photos: this.photos.map(p => p.toRequestDto())
        };
    }
}

export class SupplyCreatingAuthorizationModel implements IHasStatsCreatingAuthorizationModel {
    public readonly canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.Supply.CreatingAuthorization) {
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}

export class SupplyExistingAuthorizationModel implements IHasStatsExistingAuthorizationModel {
    public readonly canEdit: boolean = true;
    public readonly canDelete: boolean = false;
    public readonly canSetStatsDateTime: boolean;

    constructor(responseDto: ResponseDtos.Supply.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}