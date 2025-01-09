export class OrderItemUpdateHistoryModel implements IExportProductItemUpdateHistoryModel {
    public readonly id: number;
    public readonly productAmountPerUnit: number;
    public readonly vatAmountPerUnit: number;
    public readonly quantity: number;
    public readonly productName: string;

    constructor(dataDto: ResponseDtos.Order.ItemUpdateHistory) {
        this.id = dataDto.id;
        this.productAmountPerUnit = dataDto.productAmountPerUnit;
        this.vatAmountPerUnit = dataDto.vatAmountPerUnit;
        this.quantity = dataDto.quantity;
        this.productName = dataDto.productName;
    }
}