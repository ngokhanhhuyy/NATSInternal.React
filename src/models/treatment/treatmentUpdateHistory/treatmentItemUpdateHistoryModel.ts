export class TreatmentItemUpdateHistoryModel
        implements IExportProductItemUpdateHistoryModel {
    public id: number;
    public productAmountPerUnit: number;
    public vatAmountPerUnit: number;
    public quantity: number;
    public productName: string;

    constructor(responseDto: ResponseDtos.Treatment.ItemUpdateHistory) {
        this.id = responseDto.id;
        this.productAmountPerUnit = responseDto.productAmountPerUnit;
        this.vatAmountPerUnit = responseDto.vatAmountPerUnit;
        this.quantity = responseDto.quantity;
        this.productName = responseDto.productName;
    }
}