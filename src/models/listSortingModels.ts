export class ListSortingByFieldModel {
    public name: string;
    public displayName: string;

    constructor(responseDto: ResponseDtos.List.SortingByField) {
        this.name = responseDto.name;
        this.displayName = responseDto.displayName;
    }
}

export class ListSortingOptionsModel {
    public fieldOptions: ListSortingByFieldModel[];
    public defaultFieldName: string;
    public defaultAscending: boolean;

    constructor(responseDto: ResponseDtos.List.SortingOptions) {
        this.fieldOptions = responseDto.fieldOptions.map(o => new ListSortingByFieldModel(o));
        this.defaultFieldName = responseDto.defaultFieldName;
        this.defaultAscending = responseDto.defaultAscending;
    }
}