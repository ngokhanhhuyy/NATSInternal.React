import { DebtIncurrenceExistingAuthorizationModel }
    from "./debtIncurrenceExistingAuthorizationModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class DebtIncurrenceBasicModel
        implements IDebtBasicModel<DebtIncurrenceExistingAuthorizationModel> {
    public readonly id: number;
    public readonly amount: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly authorization: DebtIncurrenceExistingAuthorizationModel | null;

    constructor(responseDto: ResponseDtos.DebtIncurrence.Basic) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.authorization = responseDto.authorization &&
            new DebtIncurrenceExistingAuthorizationModel(responseDto.authorization);
    }

    public get detailRoute(): string {
        return routeGenerator.getDebtIncurrenceDetailRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getDebtIncurrenceUpdateRoutePath(this.id);
    }
}