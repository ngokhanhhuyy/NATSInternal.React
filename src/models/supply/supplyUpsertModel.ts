import { AbstractClonableModel } from "../baseModels";
import { SupplyUpsertItemModel } from "./supplyItem/supplyUpsertItemModel";
import { SupplyUpsertPhotoModel } from "./supplyPhoto/supplyUpsertPhotoModel";
import { StatsDateTimeInputModel } from "../dateTime/statsDateTimeInputModel";

export class SupplyUpsertModel
        extends AbstractClonableModel<SupplyUpsertModel>
        implements IHasProductUpsertModel<
            SupplyUpsertModel,
            SupplyUpsertItemModel,
            SupplyUpsertPhotoModel> {
    public id: number = 0;
    public statsDateTime: StatsDateTimeInputModel = new StatsDateTimeInputModel();
    public shipmentFee: number = 0;
    public note: string = "";
    public items: SupplyUpsertItemModel[] = [];
    public photos: SupplyUpsertPhotoModel[] = [];
    public updatedReason: string = "";
    public canSetStatsDateTime: boolean = false;
    public canDelete: boolean = false;

    public fromDetailResponseDto(responseDto: ResponseDtos.Supply.Detail): SupplyUpsertModel {
        let items = this.items;
        if (responseDto.items) {
            items = [
                ...items,
                ...responseDto.items.map(dto => new SupplyUpsertItemModel(dto))
            ];
        }

        let photos = this.photos;
        if (responseDto.photos) {
            photos = [
                ...photos,
                ...responseDto.photos.map(dto => new SupplyUpsertPhotoModel(dto))
            ];
        }

        return this.from({
            id: responseDto.id,
            statsDateTime: this.statsDateTime
                .fromDateTimeResponseDto(responseDto.statsDateTime),
            shipmentFee: responseDto.shipmentFee,
            note: responseDto.note ?? "",
            items,
            photos,
            canSetStatsDateTime: responseDto.authorization.canSetStatsDateTime,
            canDelete: responseDto.authorization.canDelete
        });
    }

    public fromCreatingAuthorizationResponseDto(
            authorization: ResponseDtos.Supply.CreatingAuthorization | null):
                SupplyUpsertModel {
        return this.from({
            statsDateTime: this.statsDateTime.from({ isForCreating: true }),
            canSetStatsDateTime: authorization?.canSetStatsDateTime ?? false,
            canDelete: false
        });
    }

    public toRequestDto(): RequestDtos.Supply.Upsert {
        return {
            statsDateTime: this.statsDateTime.toRequestDto(),
            shipmentFee: this.shipmentFee,
            note: this.note || null,
            updatedReason: this.updatedReason || null,
            items: this.items.map(i => i.toRequestDto()),
            photos: this.photos.map(p => p.toRequestDto())
        };
    }
}