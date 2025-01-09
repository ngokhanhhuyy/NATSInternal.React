import { AbstractClonableModel } from "../baseModels";
import { OrderUpsertItemModel } from "./orderItem/orderUpsertItemModel";
import { OrderUpsertPhotoModel } from "./orderPhoto/orderUpsertPhotoModel";
import { StatsDateTimeInputModel } from "../dateTime/statsDateTimeInputModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";

export class OrderUpsertModel
        extends AbstractClonableModel<OrderUpsertModel>
        implements IExportProductUpsertModel<
            OrderUpsertModel,
            OrderUpsertItemModel,
            OrderUpsertPhotoModel> {
    public id: number = 0;
    public statsDateTime: StatsDateTimeInputModel = new StatsDateTimeInputModel();
    public note: string = "";
    public customer: CustomerBasicModel | null = null;
    public items: OrderUpsertItemModel[] = [];
    public photos: OrderUpsertPhotoModel[] = [];
    public updatedReason: string = "";
    public canSetStatsDateTime: boolean = false;
    public canDelete: boolean = false;

    public fromDetailResponseDto(responseDto: ResponseDtos.Order.Detail): OrderUpsertModel {
        return this.from({
            id: responseDto.id,
            statsDateTime: this.statsDateTime
                .fromDateTimeResponseDto(responseDto.statsDateTime),
            note: responseDto.note ?? "",
            customer: new CustomerBasicModel(responseDto.customer),
            items: responseDto.items?.map(i => new OrderUpsertItemModel(i)) ?? [],
            photos: responseDto.photos?.map(p => new OrderUpsertPhotoModel(p)) ?? [],
            canSetStatsDateTime: responseDto.authorization.canSetStatsDateTime,
            canDelete: responseDto.authorization.canDelete
        });
    }

    public fromCreatingAuthorizationResponseDto(
            responseDto: ResponseDtos.Order.CreatingAuthorization): OrderUpsertModel
    {
        return this.from({ canSetStatsDateTime: responseDto.canSetStatsDateTime });
    }

    public get productAmountBeforeVat(): number {
        return this.items.reduce(
            (amount, item) => amount + item.productAmountPerUnit * item.quantity, 0);
    }

    public get productVatAmount(): number {
        return this.items.reduce(
            (amount, item) => amount + item.vatAmountPerUnit * item.quantity, 0);
    }

    public get productAmountAfterVat(): number  {
        return this.amountBeforeVat + this.productVatAmount;
    }

    public get amountBeforeVat(): number {
        return this.productAmountBeforeVat;
    }

    public get vatAmount(): number {
        return this.productVatAmount;
    }

    public get amountAfterVat(): number {
        return this.productAmountAfterVat;
    }

    public toRequestDto(): RequestDtos.Order.Upsert {
        return {
            statsDateTime: this.statsDateTime.toRequestDto(),
            note: this.note || null,
            customerId: (this.customer && this.customer.id) ?? 0,
            items: this.items.map(i => i.toRequestDto()),
            photos: this.photos.map(p => p.toRequestDto()),
            updatedReason: this.updatedReason || null
        };
    }
}