import { AbstractClonableModel } from "@/models/baseModels";

export class OrderUpsertPhotoModel
        extends AbstractClonableModel<OrderUpsertPhotoModel>
        implements IUpsertPhotoModel<OrderUpsertPhotoModel> {
    public readonly id: number | null = null;
    public readonly url: string | null = null;
    public readonly file: string | null = null;
    public readonly hasBeenChanged: boolean = false;
    public readonly hasBeenDeleted: boolean = false;

    constructor(responseDto?: ResponseDtos.Order.DetailPhoto) {
        super();
        if (responseDto) {
            this.id = responseDto.id;
            this.url = responseDto.url;
        }
    }

    public toRequestDto(): RequestDtos.Order.UpsertPhoto {
        return {
            id: this.id,
            file: this.file,
            hasBeenChanged: this.hasBeenChanged,
            hasBeenDeleted: this.hasBeenDeleted
        };
    }
}