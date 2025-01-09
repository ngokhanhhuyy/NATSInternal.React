export class SupplyDetailPhotoModel implements IDetailPhotoModel {
    public readonly id: number;
    public readonly url: string;

    constructor(responseDto: ResponseDtos.Supply.DetailPhoto) {
        this.id = responseDto.id;
        this.url = responseDto.url;
    }
}