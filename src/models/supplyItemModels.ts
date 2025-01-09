import { ProductBasicModel } from "./productModels";

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

export class SupplyUpsertItemModel implements IHasProductUpsertItemModel {
    public id: number | null = null;
    public productAmountPerUnit: number = 0;
    public quantity: number = 0;
    public product: ProductBasicModel;
    public hasBeenChanged: boolean = false;
    public hasBeenDeleted: boolean = false;

    constructor(arg: ProductBasicModel | ResponseDtos.Supply.DetailItem) {
        if (arg instanceof ProductBasicModel) {
            this.product = arg;
            this.productAmountPerUnit = this.product.defaultPrice;
            this.quantity = 1;
        } else {
            this.id = arg.id;
            this.productAmountPerUnit = arg.productAmountPerUnit;
            this.quantity = arg.quantity;
            this.product = new ProductBasicModel(arg.product);
        }
    }

    public toRequestDto(): RequestDtos.Supply.UpsertItem {
        return {
            id: this.id,
            productAmountPerUnit: this.productAmountPerUnit,
            quantity: this.quantity,
            productId: this.product.id,
            hasBeenChanged: this.hasBeenChanged,
            hasBeenDeleted: this.hasBeenDeleted
        };
    }
}