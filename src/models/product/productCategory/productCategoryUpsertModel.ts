import { AbstractClonableModel } from "@/models/baseModels";

export class ProductCategoryUpsertModel
        extends AbstractClonableModel<ProductCategoryUpsertModel> {
    public readonly id: number = 0;
    public readonly name: string = "";
    public readonly canDelete: boolean | undefined;

    constructor(responseDto?: ResponseDtos.ProductCategory.Detail) {
        super();

        if (responseDto) {
            this.id = responseDto.id;
            this.name = responseDto.name;
            this.canDelete = responseDto.authorization.canDelete;
        }
    }

    public toRequestDto(): RequestDtos.ProductCategory.Upsert {
        return { name: this.name };
    }
}