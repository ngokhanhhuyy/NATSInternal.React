import { ExpenseCategory } from "@/services/dtos/enums";
import { UserBasicModel } from "@/models/user/userBasicModel";
import { DateTimeDisplayModel } from "@/models/dateTime/dateTimeDisplayModel";

export class ExpenseUpdateHistoryModel implements IHasStatsUpdateHistoryModel {
    public readonly updatedDateTime: DateTimeDisplayModel;
    public readonly updatedUser: UserBasicModel;
    public readonly updatedReason: string;
    public readonly oldStatsDateTime: DateTimeDisplayModel;
    public readonly oldAmount: number;
    public readonly oldCategory: ExpenseCategory;
    public readonly oldNote: string | null;
    public readonly oldPayeeName: string;
    public readonly newStatsDateTime: DateTimeDisplayModel;
    public readonly newAmount: number;
    public readonly newCategory: ExpenseCategory;
    public readonly newNote: string | null;
    public readonly newPayeeName: string;

    constructor(responseDto: ResponseDtos.Expense.UpdateHistory) {
        this.updatedDateTime = new DateTimeDisplayModel(responseDto.updatedDateTime);
        this.updatedUser = new UserBasicModel(responseDto.updatedUser);
        this.updatedReason = responseDto.updatedReason;
        this.oldStatsDateTime = new DateTimeDisplayModel(responseDto.oldStatsDateTime);
        this.oldAmount = responseDto.oldAmount;
        this.oldCategory = responseDto.oldCategory;
        this.oldNote = responseDto.oldNote;
        this.oldPayeeName = responseDto.oldPayeeName;
        this.newStatsDateTime = new DateTimeDisplayModel(responseDto.newStatsDateTime);
        this.newAmount = responseDto.newAmount;
        this.newCategory = responseDto.newCategory;
        this.newNote = responseDto.newNote;
        this.newPayeeName = responseDto.newPayeeName;
    }
}