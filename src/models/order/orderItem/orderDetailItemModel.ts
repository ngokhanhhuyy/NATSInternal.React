import { ProductBasicModel } from "../../product/productBasicModel";

export class OrderDetailItemModel implements IExportProductDetailItemModel {
    public readonly id: number | null = null;
    public readonly productAmountPerUnit: number = 0;
    public readonly vatAmountPerUnit: number = 0;
    public readonly quantity: number = 1;
    public readonly productId: number;
    public readonly product: ProductBasicModel | null = null;

    constructor(responseDto: ResponseDtos.Order.DetailItem) {
        this.id = responseDto.id;
        this.productAmountPerUnit = responseDto.productAmountPerUnit;
        this.vatAmountPerUnit = responseDto.vatAmountPerUnit;
        this.quantity = responseDto.quantity;
        this.productId = responseDto.product.id;
        this.product = new ProductBasicModel(responseDto.product);
    }

    public get productAmount(): number {
        return this.productAmountPerUnit * this.quantity;
    }
}