import { UserBasicModel } from "./userModels";
import { DateTimeDisplayModel } from "./dateTimeModels";

export class SupplyUpdateHistoryModel
        implements IHasProductUpdateHistoryModel<SupplyItemUpdateHistoryModel> {
    public updatedDateTime: DateTimeDisplayModel;
    public updatedUser: UserBasicModel;
    public updatedReason: string;
    public oldStatsDateTime: DateTimeDisplayModel;
    public oldShipmentFee: number;
    public oldNote: string;
    public oldItems: SupplyItemUpdateHistoryModel[];
    public newStatsDateTime: DateTimeDisplayModel;
    public newShipmentFee: number;
    public newNote: string;
    public newItems: SupplyItemUpdateHistoryModel[];

    constructor(responseDto: ResponseDtos.Supply.UpdateHistory) {
        this.updatedDateTime = new DateTimeDisplayModel(responseDto.updatedDateTime);
        this.updatedUser = new UserBasicModel(responseDto.updatedUser);
        this.updatedReason = responseDto.updatedReason;
        this.oldStatsDateTime = new DateTimeDisplayModel(responseDto.oldStatsDateTime);
        this.oldShipmentFee = responseDto.oldShipmentFee;
        this.oldNote = responseDto.oldNote ?? "";
        this.oldItems = responseDto.oldItems?.map(i => new SupplyItemUpdateHistoryModel(i))
            ?? [];
        this.newStatsDateTime = new DateTimeDisplayModel(responseDto.newStatsDateTime);
        this.newShipmentFee = responseDto.newShipmentFee;
        this.newNote = responseDto.newNote ?? "";
        this.newItems = responseDto.newItems?.map(i => new SupplyItemUpdateHistoryModel(i))
            ?? [];
    }
}

export class SupplyItemUpdateHistoryModel implements IHasProductItemUpdateHistoryModel {
    public id: number;
    public productAmountPerUnit: number;
    public quantity: number;
    public productName: string;

    constructor(dataDto: ResponseDtos.Supply.ItemUpdateHistory) {
        this.id = dataDto.id;
        this.productAmountPerUnit = dataDto.productAmountPerUnit;
        this.quantity = dataDto.quantity;
        this.productName = dataDto.productName;
    }
}