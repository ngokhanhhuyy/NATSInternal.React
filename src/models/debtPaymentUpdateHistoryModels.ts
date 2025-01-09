import { UserBasicModel } from "./userModels";
import { DateTimeDisplayModel } from "./dateTimeModels";

export class DebtPaymentUpdateHistoryModel implements IDebtUpdateHistoryModel {
    public updatedDateTime: DateTimeDisplayModel;
    public updatedUser: UserBasicModel;
    public updatedReason: string;
    public oldStatsDateTime: DateTimeDisplayModel;
    public oldAmount: number;
    public oldNote: string;
    public newStatsDateTime: DateTimeDisplayModel;
    public newAmount: number;
    public newNote: string;

    constructor(responseDto: ResponseDtos.DebtPayment.UpdateHistory) {
        this.updatedDateTime = new DateTimeDisplayModel(responseDto.updatedDateTime);
        this.updatedUser = new UserBasicModel(responseDto.updatedUser);
        this.updatedReason = responseDto.updatedReason;
        this.oldStatsDateTime = new DateTimeDisplayModel(responseDto.oldStatsDateTime);
        this.oldAmount = responseDto.oldAmount;
        this.oldNote = responseDto.oldNote ?? "";
        this.newStatsDateTime = new DateTimeDisplayModel(responseDto.newStatsDateTime);
        this.newAmount = responseDto.newAmount;
        this.newNote = responseDto.newNote ?? "";
    }
}