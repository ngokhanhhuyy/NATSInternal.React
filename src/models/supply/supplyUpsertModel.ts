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

    constructor(canSetStatsDateTime: boolean);
    constructor(responseDto: ResponseDtos.Supply.Detail);
    constructor(arg: boolean | ResponseDtos.Supply.Detail) {
        super();

        if (typeof arg === "boolean") {
            this.canSetStatsDateTime = arg;
        } else {
            this.id = arg.id;
            this.statsDateTime = this.statsDateTime.fromDateTimeResponseDto(arg.statsDateTime);
            this.shipmentFee = arg.shipmentFee;
            this.note = arg.note ?? "";
            this.items = arg.items.map(dto => new SupplyUpsertItemModel(dto));
            this.photos = arg.photos?.map(dto => new SupplyUpsertPhotoModel(dto)) ?? [];
            this.canSetStatsDateTime = arg.authorization.canSetStatsDateTime;
            this.canDelete = arg.authorization.canDelete;
        }
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