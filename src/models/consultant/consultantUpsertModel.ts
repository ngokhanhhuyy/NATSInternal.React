import { AbstractClonableModel } from "../baseModels";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { StatsDateTimeInputModel } from "../dateTime/statsDateTimeInputModel";

export class ConsultantUpsertModel
        extends AbstractClonableModel<ConsultantUpsertModel>
        implements IHasCustomerUpsertModel<ConsultantUpsertModel> {
    public readonly id: number = 0;
    public readonly amountBeforeVat: number = 0;
    public readonly vatPercentage: number = 0;
    public readonly note: string = "";
    public readonly statsDateTime: StatsDateTimeInputModel = new StatsDateTimeInputModel();
    public readonly customer: CustomerBasicModel | null = null;
    public readonly updatedReason: string = "";
    public readonly canSetStatsDateTime: boolean = false;
    public readonly canDelete: boolean = false;

    constructor(canSetStatsDateTime: boolean);
    constructor(responseDto: ResponseDtos.Consultant.Detail);
    constructor(arg: boolean | ResponseDtos.Consultant.Detail) {
        super();

        if (typeof arg === "boolean") {
            this.canSetStatsDateTime = arg;
        } else {
            this.id = arg.id;
            this.amountBeforeVat = arg.amountBeforeVat;
            this.vatPercentage = arg.vatAmount / arg.amountBeforeVat;
            this.note = arg.note ?? "";
            this.statsDateTime = this.statsDateTime
                .fromDateTimeResponseDto(arg.statsDateTime);
            this.customer = new CustomerBasicModel(arg.customer);
            this.canSetStatsDateTime = arg.authorization.canSetStatsDateTime;
            this.canDelete = arg.authorization.canDelete;
        }
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