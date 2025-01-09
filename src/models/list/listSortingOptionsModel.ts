import { ListSortingByFieldModel } from "./listSortingByFieldModel";

export class ListSortingOptionsModel {
    public readonly fieldOptions: ListSortingByFieldModel[];
    public readonly defaultFieldName: string;
    public readonly defaultAscending: boolean;

    constructor(responseDto: ResponseDtos.List.SortingOptions) {
        this.fieldOptions = responseDto.fieldOptions.map(o => new ListSortingByFieldModel(o));
        this.defaultFieldName = responseDto.defaultFieldName;
        this.defaultAscending = responseDto.defaultAscending;
    }
}