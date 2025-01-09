import { AbstractClonableModel } from "../baseModels";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { StatsDateTimeInputModel } from "../dateTime/statsDateTimeInputModel";

type CreatingAuthorization = ResponseDtos.Consultant.CreatingAuthorization;
type Detail = ResponseDtos.Consultant.Detail;

export class ConsultantUpsertModel
        extends AbstractClonableModel<ConsultantUpsertModel>
        implements IHasCustomerUpsertModel {
    public readonly id: number = 0;
    public readonly amountBeforeVat: number = 0;
    public readonly vatPercentage: number = 0;
    public readonly note: string = "";
    public readonly statsDateTime: StatsDateTimeInputModel = new StatsDateTimeInputModel();
    public readonly customer: CustomerBasicModel | null = null;
    public readonly updatedReason: string = "";
    public readonly canSetStatsDateTime: boolean = false;
    public readonly canDelete: boolean = false;

    public fromCreatingAuthorizationResponseDto(responseDto: CreatingAuthorization):
            ConsultantUpsertModel {
        return this.from({
            canSetStatsDateTime: responseDto.canSetStatsDateTime
        });
    }

    public fromDetailResponseDto(responseDto: Detail): ConsultantUpsertModel {
        return this.from({
            id: responseDto.id,
            amountBeforeVat: responseDto.amountBeforeVat,
            vatPercentage: responseDto.vatAmount / responseDto.amountBeforeVat,
            note: responseDto.note ?? "",
            statsDateTime: this.statsDateTime
                .fromDateTimeResponseDto(responseDto.statsDateTime),
            customer: new CustomerBasicModel(responseDto.customer),
            canSetStatsDateTime: responseDto.authorization.canSetStatsDateTime,
            canDelete: responseDto.authorization.canDelete,
        });
    }

    public toRequestDto(): RequestDtos.Consultant.Upsert {
        return {
            amountBeforeVat: this.amountBeforeVat,
            vatAmount: this.amountBeforeVat * this.vatPercentage,
            note: this.note || null,
            statsDateTime: this.statsDateTime.toRequestDto(),
            updatedReason: this.updatedReason || null,
            customerId: this.customer?.id ?? 0
        };
    }
}