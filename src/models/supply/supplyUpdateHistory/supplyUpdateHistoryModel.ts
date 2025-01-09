import { UserBasicModel } from "@/models/user/userBasicModel";
import { DateTimeDisplayModel } from "@/models/dateTime/dateTimeDisplayModel";

export class SupplyUpdateHistoryModel
        implements IHasProductUpdateHistoryModel<SupplyItemUpdateHistoryModel> {
    public readonly updatedDateTime: DateTimeDisplayModel;
    public readonly updatedUser: UserBasicModel;
    public readonly updatedReason: string;
    public readonly oldStatsDateTime: DateTimeDisplayModel;
    public readonly oldShipmentFee: number;
    public readonly oldNote: string;
    public readonly oldItems: SupplyItemUpdateHistoryModel[];
    public readonly newStatsDateTime: DateTimeDisplayModel;
    public readonly newShipmentFee: number;
    public readonly newNote: string;
    public readonly newItems: SupplyItemUpdateHistoryModel[];

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
    public readonly id: number;
    public readonly productAmountPerUnit: number;
    public readonly quantity: number;
    public readonly productName: string;

    constructor(dataDto: ResponseDtos.Supply.ItemUpdateHistory) {
        this.id = dataDto.id;
        this.productAmountPerUnit = dataDto.productAmountPerUnit;
        this.quantity = dataDto.quantity;
        this.productName = dataDto.productName;
    }
}