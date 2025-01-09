import { UserBasicModel } from "./userModels";
import { DateTimeDisplayModel } from "./dateTimeModels";

export class OrderUpdateHistoryModel
        implements IExportProductUpdateHistoryModel<OrderItemUpdateHistoryModel> {
    public updatedDateTime: DateTimeDisplayModel;
    public updatedUser: UserBasicModel;
    public updatedReason: string | null;
    public oldStatsDateTime: DateTimeDisplayModel;
    public oldNote: string;
    public oldItems: OrderItemUpdateHistoryModel[];
    public newStatsDateTime: DateTimeDisplayModel;
    public newNote: string;
    public newItems: OrderItemUpdateHistoryModel[];

    constructor(responseDto: ResponseDtos.Order.UpdateHistory) {
        this.updatedDateTime = new DateTimeDisplayModel(responseDto.updatedDateTime);
        this.updatedUser = new UserBasicModel(responseDto.updatedUser);
        this.updatedReason = responseDto.updatedReason;
        this.oldStatsDateTime = new DateTimeDisplayModel(responseDto.oldStatsDateTime);
        this.oldNote = responseDto.oldNote ?? "";
        this.oldItems = responseDto.oldItems?.map(i => new OrderItemUpdateHistoryModel(i))
            ?? [];
        this.newStatsDateTime = new DateTimeDisplayModel(responseDto.newStatsDateTime);
        this.newNote = responseDto.newNote ?? "";
        this.newItems = responseDto.newItems?.map(i => new OrderItemUpdateHistoryModel(i))
            ?? [];
    }
}

export class OrderItemUpdateHistoryModel implements IExportProductItemUpdateHistoryModel {
    public id: number;
    public productAmountPerUnit: number;
    public vatAmountPerUnit: number;
    public quantity: number;
    public productName: string;

    constructor(dataDto: ResponseDtos.Order.ItemUpdateHistory) {
        this.id = dataDto.id;
        this.productAmountPerUnit = dataDto.productAmountPerUnit;
        this.vatAmountPerUnit = dataDto.vatAmountPerUnit;
        this.quantity = dataDto.quantity;
        this.productName = dataDto.productName;
    }
}