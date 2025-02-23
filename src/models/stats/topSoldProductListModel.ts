import { DateDisplayModel } from "../dateTime/dateDisplayModel";
import { TopSoldProductModel } from "./topSoldProductModel";

export class TopSoldProductListModel {
    public readonly startingDate: DateDisplayModel;
    public readonly endingDate: DateDisplayModel;
    public readonly rangeType: string;
    public readonly criteria: string;
    public readonly items: TopSoldProductModel[];

    constructor(
            listResponseDto: ResponseDtos.Stats.TopSoldProductList,
            initialResponseDto: ResponseDtos.Stats.TopSoldProductInitial) {
        this.startingDate = new DateDisplayModel(listResponseDto.startingDate);
        this.endingDate = new DateDisplayModel(listResponseDto.endingDate);
        this.items = listResponseDto.items.map(dto => new TopSoldProductModel(dto));
        this.rangeType = initialResponseDto.rangeTypeOptionList.default;
        this.criteria = initialResponseDto.criteriaOptionList.default;
    }
}