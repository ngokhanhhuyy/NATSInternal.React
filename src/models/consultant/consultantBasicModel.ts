import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { ConsultantExistingAuthorizationModel } from "./consultantExistingAuthorizationModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class ConsultantBasicModel
        implements IHasCustomerBasicModel<ConsultantExistingAuthorizationModel> {
    public readonly id: number;
    public readonly amount: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly authorization: ConsultantExistingAuthorizationModel | null;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Consultant.Basic) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.authorization = responseDto.authorization &&
            new ConsultantExistingAuthorizationModel( responseDto.authorization);
        this.detailRoute = routeGenerator.getConsultantDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getConsultantUpdateRoutePath(this.id);
    }
}