import { UserBasicModel } from "./userModels";
import { DateTimeDisplayModel } from "./dateTimeModels";

export class DebtIncurrenceUpdateHistoryModel implements IDebtUpdateHistoryModel {
    updatedDateTime: DateTimeDisplayModel;
    updatedUser: UserBasicModel;
    updatedReason: string;
    oldStatsDateTime: DateTimeDisplayModel;
    oldAmount: number;
    oldNote: string;
    newStatsDateTime: DateTimeDisplayModel;
    newAmount: number;
    newNote: string;

    constructor(responseDto: ResponseDtos.DebtIncurrence.UpdateHistory) {
        this.updatedDateTime = new DateTimeDisplayModel(responseDto.updatedDateTime);
        this.updatedUser = new UserBasicModel(responseDto.updatedUser);
        this.updatedReason = responseDto.updatedReason;
        this.oldStatsDateTime = new DateTimeDisplayModel(responseDto.oldStatsDateTime);
        this.oldAmount = responseDto.oldAmount;
        this.oldNote = responseDto.oldNote;
        this.newStatsDateTime = new DateTimeDisplayModel(responseDto.newStatsDateTime);
        this.newAmount = responseDto.newAmount;
        this.newNote = responseDto.newNote;
    }
}