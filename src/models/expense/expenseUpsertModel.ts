import { AbstractClonableModel } from "../baseModels";
import { ClonableArrayModel } from "../arrayModel";
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
    public readonly photos: ClonableArrayModel<ExpenseUpsertPhotoModel> = new ClonableArrayModel();
    public readonly updatedReason: string = "";
    public readonly canSetStatsDateTime: boolean = false;
    public readonly canDelete: boolean = false;
    
    public fromDetailResponseDto(detail: ResponseDtos.Expense.Detail): ExpenseUpsertModel {
        let photos = this.photos;
        if (detail.photos) {
            photos = photos
                .addMultiple(detail.photos.map(dto => new ExpenseUpsertPhotoModel(dto)));
        }

        return this.from({
            id: detail.id,
            amount: detail.amountAfterVat,
            statsDateTime: this.statsDateTime.fromDateTimeResponseDto(detail.statsDateTime),
            category: detail.category,
            note: detail.note ?? "",
            payeeName: detail.payee.name,
            photos: photos,
            canSetStatsDateTime: detail.authorization.canSetStatsDateTime,
            canDelete: detail.authorization.canDelete,
        });
    }

    public fromCreatingAuthorizationResponseDto(
            authorization: ResponseDtos.Expense.CreatingAuthorization | null):
                ExpenseUpsertModel {
        return this.from({
            canSetStatsDateTime: authorization?.canSetStatsDateTime ?? false,
            canDelete: false
        });
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