import { AbstractClonableModel } from "../baseModels";
import { StatsDateTimeInputModel } from "../dateTime/statsDateTimeInputModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";

export class DebtIncurrenceUpsertModel
        extends AbstractClonableModel<DebtIncurrenceUpsertModel>
        implements IDebtUpsertModel {
    public id: number = 0;
    public amount: number = 0;
    public note: string = "";
    public statsDateTime: StatsDateTimeInputModel = new StatsDateTimeInputModel();
    public customer: CustomerBasicModel | null = null;
    public updatedReason: string = "";
    public canSetStatsDateTime: boolean = false;
    public canDelete: boolean = false;
    
    public fromDetailResponseDto(responseDto: ResponseDtos.DebtIncurrence.Detail):
            DebtIncurrenceUpsertModel {
        return this.from({
            id: responseDto.id,
            amount: responseDto.amount,
            note: responseDto.note ?? "",
            statsDateTime: this.statsDateTime
                .fromDateTimeResponseDto(responseDto.statsDateTime),
            customer: new CustomerBasicModel(responseDto.customer),
            canSetStatsDateTime: responseDto.authorization.canSetStatsDateTime,
            canDelete: responseDto.authorization.canDelete,
        });
    }
    

    public fromCreatingAuthorizationResponseDto(
            responseDto: ResponseDtos.DebtIncurrence.CreatingAuthorization) {
        return this.from({ canSetStatsDateTime: responseDto.canSetStatsDateTime });
    }

    public toRequestDto(): RequestDtos.DebtIncurrence.Upsert {
        return {
            amount: this.amount,
            note: this.note,
            statsDateTime: this.statsDateTime.toRequestDto(),
            customerId: this.customer?.id ?? 0,
            updatedReason: this.updatedReason || null
        };
    }
}