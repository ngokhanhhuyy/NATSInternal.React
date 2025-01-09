import { UserBasicModel } from "../../user/userBasicModel";
import { DateTimeDisplayModel } from "../../dateTime/dateTimeDisplayModel";

export class ConsultantUpdateHistoryModel implements IHasStatsUpdateHistoryModel {
    public readonly updatedDateTime: DateTimeDisplayModel;
    public readonly updatedUser: UserBasicModel;
    public readonly updatedReason: string;
    public readonly oldStatsDateTime: DateTimeDisplayModel;
    public readonly oldAmount: number;
    public readonly oldNote: string;
    public readonly newStatsDateTime: DateTimeDisplayModel;
    public readonly newAmount: number;
    public readonly newNote: string;

    constructor(responseDto: ResponseDtos.Consultant.UpdateHistory) {
        this.updatedDateTime = new DateTimeDisplayModel(responseDto.updatedDateTime);
        this.updatedUser = new UserBasicModel(responseDto.updatedUser);
        this.updatedReason = responseDto.updatedReason;
        this.oldStatsDateTime = new DateTimeDisplayModel(responseDto.oldStatsDateTime);
        this.oldAmount = responseDto.oldAmountBeforeVat;
        this.oldNote = responseDto.oldNote;
        this.newStatsDateTime = new DateTimeDisplayModel(responseDto.newStatsDateTime);
        this.newAmount = responseDto.newAmountBeforeVat;
        this.newNote = responseDto.newNote;
    }
}