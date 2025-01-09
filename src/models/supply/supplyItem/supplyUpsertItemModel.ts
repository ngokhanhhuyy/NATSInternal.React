import { AbstractClonableModel } from "@/models/baseModels";
import { ProductBasicModel } from "@/models/product/productBasicModel";

export class SupplyUpsertItemModel
        extends AbstractClonableModel<SupplyUpsertItemModel>
        implements IHasProductUpsertItemModel<SupplyUpsertItemModel> {
    public readonly id: number | null = null;
    public readonly productAmountPerUnit: number = 0;
    public readonly quantity: number = 0;
    public readonly product: ProductBasicModel;
    public readonly hasBeenChanged: boolean = false;
    public readonly hasBeenDeleted: boolean = false;

    constructor(arg: ProductBasicModel | ResponseDtos.Supply.DetailItem) {
        super();
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