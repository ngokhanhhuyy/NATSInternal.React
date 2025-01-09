import { AbstractClonableModel } from "@/models/baseModels";
import { ProductBasicModel } from "../../product/productBasicModel";

export class OrderUpsertItemModel
        extends AbstractClonableModel<OrderUpsertItemModel>
        implements IExportProductUpsertItemModel<OrderUpsertItemModel> {
    public id: number | null = null;
    public productAmountPerUnit: number = 0;
    public vatPercentagePerUnit: number = 0;
    public quantity: number = 1;
    public productId: number;
    public product: ProductBasicModel;
    public hasBeenChanged: boolean = false;
    public hasBeenDeleted: boolean = false;

    constructor(arg: ProductBasicModel | ResponseDtos.Order.DetailItem) {
        super();
        if (arg instanceof ProductBasicModel) {
            this.productAmountPerUnit = arg.defaultPrice;
            this.vatPercentagePerUnit = arg.defaultVatPercentage;
            this.productId = arg.id;
            this.product = arg;
            this.hasBeenChanged = true;
        } else {
            this.id = arg.id;
            this.productAmountPerUnit = arg.productAmountPerUnit;
            this.vatPercentagePerUnit = arg.vatAmountPerUnit / arg.productAmountPerUnit * 100;
            this.quantity = arg.quantity;
            this.productId = arg.product.id;
            this.product = new ProductBasicModel(arg.product);
        }
    }

    public get vatAmountPerUnit(): number {
        return this.productAmountPerUnit * (this.vatPercentagePerUnit / 100);
    }

    public toRequestDto(): RequestDtos.Order.UpsertItem {
        return {
            id: this.id,
            productAmountPerUnit: this.productAmountPerUnit,
            vatAmountPerUnit: this.productAmountPerUnit + this.productAmountPerUnit *
                this.vatPercentagePerUnit,
            quantity: this.quantity,
            productId: this.productId,
            hasBeenChanged: this.hasBeenChanged,
            hasBeenDeleted: this.hasBeenDeleted
        };
    }
}