import { SupplyDetailItemModel } from "./supplyItem/supplyDetailItemModel";
import { SupplyDetailPhotoModel } from "./supplyPhoto/supplyDetailPhotoModel";
import {
    SupplyUpdateHistoryModel,
    SupplyItemUpdateHistoryModel } from "./supplyUpdateHistory/supplyUpdateHistoryModel";
import { SupplyExistingAuthorizationModel } from "./supplyExistingAuthorizationModel";
import { UserBasicModel } from "../user/userBasicModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

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
    public readonly detailRoute: string;
    public readonly updateRoute: string;

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
        this.detailRoute = routeGenerator.getSupplyDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getSupplyUpdateRoutePath(this.id);
    }

    public get amount(): number {
        return this.items.reduce((amount, item) => amount + item.productAmount, 0);
    }

    public get lastUpdatedDateTime(): DateTimeDisplayModel | null {
        if (this.updateHistories && this.updateHistories.length) {
            return this.updateHistories[this.updateHistories.length - 1].updatedDateTime;
        }

        return null;
    }
}