export class ListMonthYearModel {
    public month: number;
    public year: number;
    
    constructor(responseDto: ResponseDtos.List.MonthYear) {
        this.month = responseDto.month;
        this.year = responseDto.year;
    }

    public toRequestDto(): RequestDtos.List.MonthYear {
        return {
            year: this.year,
            month: this.month
        };
    }

    public toString(): string {
        return `Tháng ${this.month}, ${this.year}`;
    }
}

export class ListMonthYearOptionsModel {
    public options: ListMonthYearModel[];
    public default: ListMonthYearModel;

    constructor(responseDto: ResponseDtos.List.MonthYearOptions) {
        this.options = responseDto.options
            ?.map(option => new ListMonthYearModel(option)) ?? [];
        this.default = responseDto.default && new ListMonthYearModel(responseDto.default);
    }
}