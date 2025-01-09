import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { TreatmentExistingAuthorizationModel } from "./treatmentExistingAuthorizationModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class TreatmentBasicModel implements
        IHasStatsBasicModel<TreatmentExistingAuthorizationModel> {
    public readonly id: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly amount: number;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly authorization: TreatmentExistingAuthorizationModel | null;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Treatment.Basic) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.amount = responseDto.amount;
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.authorization = responseDto.authorization &&
            new TreatmentExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = routeGenerator.getTreatmentDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getTreatmentUpdateRoutePath(this.id);
    }
}