export class ProductCategoryMinimalModel {
    public readonly id: number;
    public readonly name: string;

    constructor(responseDto: ResponseDtos.ProductCategory.Minimal) {
        this.id = responseDto.id;
        this.name = responseDto.name;
    }
}