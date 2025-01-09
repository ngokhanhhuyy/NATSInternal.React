export class ProductDetailPhotoModel implements IDetailPhotoModel {
    public id: number;
    public url: string;

    constructor(responseDto: ResponseDtos.Product.DetailPhoto) {
        this.id = responseDto.id;
        this.url = responseDto.url;
    }
}