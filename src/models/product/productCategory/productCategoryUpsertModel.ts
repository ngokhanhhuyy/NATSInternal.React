import { AbstractClonableModel } from "@/models/baseModels";

export class ProductCategoryUpsertModel
        extends AbstractClonableModel<ProductCategoryUpsertModel> {
    public readonly id: number = 0;
    public readonly name: string = "";
    public readonly canDelete: boolean | undefined;

    fromResponseDto(responseDto: ResponseDtos.ProductCategory.Detail) {
        return this.from({
            id: responseDto.id,
            name: responseDto.name,
            canDelete: responseDto.authorization.canDelete
        });
    }

    public toRequestDto(): RequestDtos.ProductCategory.Upsert {
        return { name: this.name };
    }
}