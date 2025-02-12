import { UserBasicModel } from "@/models/user/userBasicModel";
import { DateTimeDisplayModel } from "@/models/dateTime/dateTimeDisplayModel";

export class DebtIncurrenceUpdateHistoryModel implements IDebtUpdateHistoryModel {
    readonly updatedDateTime: DateTimeDisplayModel;
    readonly updatedUser: UserBasicModel;
    readonly updatedReason: string;
    readonly oldStatsDateTime: DateTimeDisplayModel;
    readonly oldAmount: number;
    readonly oldNote: string;
    readonly newStatsDateTime: DateTimeDisplayModel;
    readonly newAmount: number;
    readonly newNote: string;

    constructor(responseDto: ResponseDtos.DebtIncurrence.UpdateHistory) {
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