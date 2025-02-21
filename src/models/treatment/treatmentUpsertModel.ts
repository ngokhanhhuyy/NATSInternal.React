import { AbstractClonableModel } from "../baseModels";
import { TreatmentUpsertItemModel } from "./treatmentItem/treatmentUpsertItemModel";
import { TreatmentUpsertPhotoModel } from "./treatmentPhoto/TreatmentUpsertPhotoModel";
import { StatsDateTimeInputModel } from "../dateTime/statsDateTimeInputModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { UserBasicModel } from "../user/userBasicModel";

export class TreatmentUpsertModel
        extends AbstractClonableModel<TreatmentUpsertModel>
        implements IExportProductUpsertModel<
            TreatmentUpsertModel,
            TreatmentUpsertItemModel,
            TreatmentUpsertPhotoModel> {
    public id: number = 0;
    public statsDateTime: StatsDateTimeInputModel = new StatsDateTimeInputModel();
    public serviceAmountBeforeVat: number = 0;
    public serviceVatPercentage: number = 0;
    public note: string = "";
    public customer: CustomerBasicModel | null = null;
    public therapist: UserBasicModel | null = null;
    public items: TreatmentUpsertItemModel[] = [];
    public photos: TreatmentUpsertPhotoModel[] = [];
    public updatedReason: string = "";
    public canSetStatsDateTime: boolean = false;
    public canDelete: boolean = false;

    public fromDetailResponseDto(responseDto: ResponseDtos.Treatment.Detail):
            TreatmentUpsertModel {
        return this.from({
            id: responseDto.id,
            statsDateTime: this.statsDateTime
                .fromDateTimeResponseDto(responseDto.statsDateTime),
            serviceAmountBeforeVat: responseDto.serviceAmountBeforeVat,
            serviceVatPercentage: responseDto.serviceAmountBeforeVat === 0
                ? 0
                : responseDto.serviceVatAmount / responseDto.serviceAmountBeforeVat * 100,
            note: responseDto.note ?? "",
            customer: new CustomerBasicModel(responseDto.customer),
            items: responseDto.items?.map(i => new TreatmentUpsertItemModel(i)) ?? [],
            photos: responseDto.photos?.map(p => new TreatmentUpsertPhotoModel(p)) ?? [],
            canSetStatsDateTime: responseDto.authorization.canSetStatsDateTime,
            canDelete: responseDto.authorization.canDelete
        });
    }

    public fromCreatingAuthorizationResponseDto(
            responseDto: ResponseDtos.Treatment.CreatingAuthorization) {
        return this.from({ canSetStatsDateTime: responseDto.canSetStatsDateTime });
    }

    public get productAmountBeforeVat(): number {
        return this.items.reduce(
            (amount, item) => amount + (item.productAmountPerUnit * item.quantity), 0);
    }

    public get productVatAmount(): number {
        return this.items.reduce(
            (amount, item) => amount + (item.vatAmountPerUnit * item.quantity), 0);
    }

    public get productAmountAfterVat(): number  {
        return this.productAmountBeforeVat + this.productVatAmount;
    }

    public get serviceVatAmount(): number {
        return this.serviceAmountBeforeVat * (this.serviceVatPercentage / 100);
    }

    public get serviceAmountAfterVat(): number {
        return this.serviceAmountBeforeVat + this.serviceVatAmount;
    }

    public get amountBeforeVat(): number {
        return this.productAmountBeforeVat + this.serviceAmountBeforeVat;
    }

    public get vatAmount(): number {
        return this.serviceVatAmount + this.productVatAmount;
    }

    public get amountAfterVat(): number {
        return this.productAmountBeforeVat + this.serviceAmountBeforeVat + this.vatAmount;
    }
    
    public toRequestDto(): RequestDtos.Treatment.Upsert {
        return {
            statsDateTime: this.statsDateTime.toRequestDto(),
            serviceAmountBeforeVat: this.serviceAmountBeforeVat,
            serviceVatFactor: this.serviceVatPercentage / 100,
            note: this.note || null,
            customerId: this.customer?.id ?? 0,
            therapistId: this.therapist?.id ?? null,
            updatedReason: this.updatedReason || null,
            items: this.items.map(i => i.toRequestDto()),
            photos: this.photos.map(p => p.toRequestDto())
        };
    }
}