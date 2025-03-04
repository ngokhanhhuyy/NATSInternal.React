type CategoryMinimalResponseDto = ResponseDtos.ProductCategory.Minimal;
type CategoryBasicResponseDto = ResponseDtos.ProductCategory.Basic;

export class ProductCategoryMinimalModel {
    public readonly id: number;
    public readonly name: string;

    constructor(responseDto: CategoryMinimalResponseDto | CategoryBasicResponseDto) {
        this.id = responseDto.id;
        this.name = responseDto.name;
    }
}