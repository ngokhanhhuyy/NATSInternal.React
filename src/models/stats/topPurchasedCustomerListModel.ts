import { DateDisplayModel } from "../dateTime/dateDisplayModel";
import { TopPurchasedCustomerModel } from "./topPurchasedCustomerModel";

export class TopPurchasedCustomerListModel {
    public readonly startingDate: DateDisplayModel;
    public readonly endingDate: DateDisplayModel;
    public readonly rangeType: string;
    public readonly criteria: string;
    public readonly items: TopPurchasedCustomerModel[];

    constructor(
            listResponseDto: ResponseDtos.Stats.TopPurchasedCustomerList,
            initialResponseDto: ResponseDtos.Stats.TopPurchasedCustomerInitial) {
        this.startingDate = new DateDisplayModel(listResponseDto.startingDate);
        this.endingDate = new DateDisplayModel(listResponseDto.endingDate);
        this.items = listResponseDto.items.map(dto => new TopPurchasedCustomerModel(dto));
        this.rangeType = initialResponseDto.rangeTypeOptionList.default;
        this.criteria = initialResponseDto.criteriaOptionList.default;
    }
}