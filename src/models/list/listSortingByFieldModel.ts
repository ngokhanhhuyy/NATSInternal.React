export class ListSortingByFieldModel {
    public readonly name: string;
    public readonly displayName: string;

    constructor(responseDto: ResponseDtos.List.SortingByField) {
        this.name = responseDto.name;
        this.displayName = responseDto.displayName;
    }
}