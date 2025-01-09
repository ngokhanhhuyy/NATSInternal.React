import { UserBasicModel } from "./userModels";
import { DateTimeDisplayModel } from "./dateTimeModels";

export class TreatmentUpdateHistoryModel
        implements IExportProductUpdateHistoryModel<TreatmentItemUpdateHistoryModel> {
    public updatedDateTime: DateTimeDisplayModel;
    public updatedUser: UserBasicModel;
    public updatedReason: string;
    public oldStatsDateTime: DateTimeDisplayModel;
    public oldServiceAmount: number;
    public oldVatPercentage: number;
    public oldNote: string | null;
    public oldTherapist: UserBasicModel;
    public oldItems: TreatmentItemUpdateHistoryModel[];
    public newStatsDateTime: DateTimeDisplayModel;
    public newServiceAmount: number;
    public newVatPercentage: number;
    public newNote: string | null;
    public newTherapist: UserBasicModel;
    public newItems: TreatmentItemUpdateHistoryModel[];

    constructor(responseDto: ResponseDtos.Treatment.UpdateHistory) {
        this.updatedDateTime = new DateTimeDisplayModel(responseDto.updatedDateTime);
        this.updatedUser = new UserBasicModel(responseDto.updatedUser);
        this.updatedReason = responseDto.updatedReason;
        this.oldStatsDateTime = new DateTimeDisplayModel(responseDto.oldStatsDateTime);
        this.oldServiceAmount = responseDto.oldServiceAmount;
        this.oldVatPercentage = Math.round(responseDto.oldServiceVatAmount * 100);
        this.oldNote = responseDto.oldNote;
        this.oldTherapist = new UserBasicModel(responseDto.oldTherapist);
        this.oldItems = responseDto.oldItems?.map(i => new TreatmentItemUpdateHistoryModel(i))
            ?? [];
        this.newStatsDateTime =  new DateTimeDisplayModel(responseDto.newStatsDateTime);
        this.newServiceAmount = responseDto.newServiceAmount;
        this.newVatPercentage = Math.round(responseDto.newServiceVatAmount * 100);
        this.newNote = responseDto.newNote;
        this.newTherapist = new UserBasicModel(responseDto.newTherapist);
        this.newItems = responseDto.newItems?.map(i => new TreatmentItemUpdateHistoryModel(i))
            ?? [];
    }
}

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