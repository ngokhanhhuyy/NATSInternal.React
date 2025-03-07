import { AbstractClonableModel } from "../baseModels";
import { ExpenseCategory } from "@/services/dtos/enums";
import { ExpenseUpsertPhotoModel } from "./expensePhoto/expenseUpsertPhotoModel";
import { StatsDateTimeInputModel } from "../dateTime/statsDateTimeInputModel";

export class ExpenseUpsertModel
        extends AbstractClonableModel<ExpenseUpsertModel>
        implements
            IHasStatsUpsertModel<ExpenseUpsertModel>,
            IHasMultiplePhotoUpsertModel<ExpenseUpsertPhotoModel> {
    public readonly id: number = 0;
    public readonly amount: number = 0;
    public readonly statsDateTime: StatsDateTimeInputModel = new StatsDateTimeInputModel();
    public readonly category: ExpenseCategory = ExpenseCategory.Equipment;
    public readonly note: string = "";
    public readonly payeeName: string = "";
    public readonly photos: ExpenseUpsertPhotoModel[] = [];
    public readonly updatedReason: string = "";
    public readonly canSetStatsDateTime: boolean = false;
    public readonly canDelete: boolean = false;

    constructor(canSetStatsDateTime: boolean);
    constructor(responseDto: ResponseDtos.Expense.Detail);
    constructor(arg: boolean | ResponseDtos.Expense.Detail) {
        super();

        if (typeof arg === "boolean") {
            this.canSetStatsDateTime = arg;
        } else {
            this.id = arg.id;
            this.amount = arg.amountAfterVat;
            this.statsDateTime = this.statsDateTime.fromDateTimeResponseDto(arg.statsDateTime);
            this.category = arg.category;
            this.note = arg.note ?? "";
            this.payeeName = arg.payee.name;
            this.photos = arg.photos?.map(dto => new ExpenseUpsertPhotoModel(dto)) ?? [];
            this.canSetStatsDateTime = arg.authorization.canSetStatsDateTime;
            this.canDelete = arg.authorization.canDelete;
        }
    }

    public toRequestDto(): RequestDtos.Expense.Upsert {
        return {
            amount: this.amount,
            statsDateTime: this.statsDateTime.toRequestDto(),
            category: this.category,
            note: this.note || null,
            payeeName: this.payeeName,
            photos: this.photos.length ? this.photos.map(p => p.toRequestDto()) : null,
            updatedReason: this.updatedReason || null
        };
    }
}