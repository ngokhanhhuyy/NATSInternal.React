import { ListMonthYearModel } from "./listMonthYearModel";

export class ListMonthYearOptionsModel {
    public readonly options: ListMonthYearModel[];
    public readonly default: ListMonthYearModel;

    constructor(responseDto: ResponseDtos.List.MonthYearOptions) {
        this.options = responseDto.options
            ?.map(option => new ListMonthYearModel(option)) ?? [];
        this.default = responseDto.default && new ListMonthYearModel(responseDto.default);
    }
}