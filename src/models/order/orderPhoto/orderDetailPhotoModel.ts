export class OrderDetailPhotoModel implements IDetailPhotoModel {
    public readonly id: number;
    public readonly url: string;

    constructor(responseDto: ResponseDtos.Order.DetailPhoto) {
        this.id = responseDto.id;
        this.url = responseDto.url;
    }
}