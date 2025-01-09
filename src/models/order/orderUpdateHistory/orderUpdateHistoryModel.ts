import { OrderItemUpdateHistoryModel } from "./orderItemUpdateHistoryModel";
import { UserBasicModel } from "@/models/user/userBasicModel";
import { DateTimeDisplayModel } from "@/models/dateTime/dateTimeDisplayModel";

export class OrderUpdateHistoryModel
        implements IExportProductUpdateHistoryModel<OrderItemUpdateHistoryModel> {
    public readonly updatedDateTime: DateTimeDisplayModel;
    public readonly updatedUser: UserBasicModel;
    public readonly updatedReason: string | null;
    public readonly oldStatsDateTime: DateTimeDisplayModel;
    public readonly oldNote: string;
    public readonly oldItems: OrderItemUpdateHistoryModel[];
    public readonly newStatsDateTime: DateTimeDisplayModel;
    public readonly newNote: string;
    public readonly newItems: OrderItemUpdateHistoryModel[];

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