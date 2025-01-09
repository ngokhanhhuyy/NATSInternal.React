export class ProductDetailPhotoModel implements IDetailPhotoModel {
    public id: number;
    public url: string;

    constructor(responseDto: ResponseDtos.Product.DetailPhoto) {
        this.id = responseDto.id;
        this.url = responseDto.url;
    }
}

export class ProductUpsertPhotoModel implements IUpsertPhotoModel {
    public id: number | null = null;
    public url: string | null = null;
    public file: string | null = null;
    public hasBeenChanged: boolean = false;
    public hasBeenDeleted: boolean = false;

    constructor(responseDto?: ResponseDtos.Product.DetailPhoto) {
        if (responseDto) {
            this.id = responseDto.id;
            this.url = responseDto.url;
        }
    }

    public toRequestDto(): RequestDtos.Product.UpsertPhoto {
        return {
            id: this.id,
            file: this.url,
            hasBeenChanged: this.hasBeenChanged,
            hasBeenDeleted: this.hasBeenDeleted
        };
    }
}