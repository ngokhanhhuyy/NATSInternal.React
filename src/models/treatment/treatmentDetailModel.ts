import { TreatmentDetailItemModel } from "./treatmentItem/treatmentDetailItemModel";
import { TreatmentDetailPhotoModel } from "./treatmentPhoto/treatmentDetailPhotoModel";
import { TreatmentUpdateHistoryModel }
    from "./treatmentUpdateHistory/treatmentUpdateHIstoryModel";
import { TreatmentItemUpdateHistoryModel }
    from "./treatmentUpdateHistory/treatmentItemUpdateHistoryModel";
import { TreatmentExistingAuthorizationModel } from "./treatmentExistingAuthorizationModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { UserBasicModel } from "../user/userBasicModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class TreatmentDetailModel implements IExportProductDetailModel<
        TreatmentDetailItemModel,
        TreatmentUpdateHistoryModel,
        TreatmentItemUpdateHistoryModel,
        TreatmentExistingAuthorizationModel> {
    public readonly id: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly serviceAmountBeforeVat: number;
    public readonly serviceVatAmount: number;
    public readonly note: string | null;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly createdUser: UserBasicModel;
    public readonly therapist: UserBasicModel | null;
    public readonly items: TreatmentDetailItemModel[];
    public readonly photos: TreatmentDetailPhotoModel[];
    public readonly updateHistories: TreatmentUpdateHistoryModel[];
    public readonly authorization: TreatmentExistingAuthorizationModel;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Treatment.Detail) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.serviceAmountBeforeVat = responseDto.serviceAmountBeforeVat;
        this.serviceVatAmount = responseDto.serviceVatAmount;
        this.note = responseDto.note;
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.therapist = responseDto.therapist && new UserBasicModel(responseDto.therapist);
        this.items = responseDto.items?.map(i => new TreatmentDetailItemModel(i)) ?? [];
        this.photos = responseDto.photos?.map(p => new TreatmentDetailPhotoModel(p)) ?? [];
        this.authorization = new TreatmentExistingAuthorizationModel(
            responseDto.authorization);
        this.updateHistories = responseDto.updateHistories
            ?.map(uh => new TreatmentUpdateHistoryModel(uh)) ?? [];
        this.detailRoute = routeGenerator.getTreatmentDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getTreatmentUpdateRoutePath(this.id);
    }

    public get productAmountBeforeVat(): number {
        let amount: number = 0;
        for (const item of this.items) {
            amount += item.productAmountPerUnit * item.quantity;
        }

        return amount;
    }

    public get productVatAmount(): number {
        let amount: number = 0;
        for (const item of this.items) {
            amount+= item.vatAmountPerUnit * item.quantity;
        }

        return amount;
    }

    public get amountBeforeVat(): number {
        return this.productAmountBeforeVat + this.serviceAmountBeforeVat;
    }

    public get vatAmount(): number {
        return this.serviceVatAmount + this.productVatAmount;
    }

    public get amountAfterVat(): number {
        return this.productAmountBeforeVat + this.productVatAmount +
            this.serviceAmountBeforeVat + this.serviceVatAmount;
    }
}