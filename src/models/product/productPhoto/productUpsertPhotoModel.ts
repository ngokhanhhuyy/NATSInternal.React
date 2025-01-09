import { AbstractClonableModel } from "@/models/baseModels";

export class ProductUpsertPhotoModel
        extends AbstractClonableModel<ProductUpsertPhotoModel>
        implements IUpsertPhotoModel<ProductUpsertPhotoModel> {
    public readonly id: number | null = null;
    public readonly url: string | null = null;
    public readonly file: string | null = null;
    public readonly hasBeenChanged: boolean = false;
    public readonly hasBeenDeleted: boolean = false;

    constructor(responseDto?: ResponseDtos.Product.DetailPhoto) {
        super();
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