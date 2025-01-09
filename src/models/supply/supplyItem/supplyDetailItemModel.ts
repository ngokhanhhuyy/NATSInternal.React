import { ProductBasicModel } from "../../product/productBasicModel";

export class SupplyDetailItemModel implements IHasProductDetailItemModel {
    public readonly id: number;
    public readonly productAmountPerUnit: number;
    public readonly quantity: number;
    public readonly product: ProductBasicModel;

    constructor(responseDto: ResponseDtos.Supply.DetailItem) {
        this.id = responseDto.id;
        this.productAmountPerUnit = responseDto.productAmountPerUnit;
        this.quantity = responseDto.quantity;
        this.product = new ProductBasicModel(responseDto.product);
    }

    public get productAmount(): number {
        return this.productAmountPerUnit * this.quantity;
    }
}