import { DebtPaymentExistingAuthorizationModel }
    from "./debtPaymentExistingAuthorizationModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class DebtPaymentBasicModel
        implements IDebtBasicModel<DebtPaymentExistingAuthorizationModel> {
    public readonly id: number;
    public readonly amount: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly authorization: DebtPaymentExistingAuthorizationModel | null;

    constructor(responseDto: ResponseDtos.DebtPayment.Basic) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.authorization = responseDto.authorization &&
            new DebtPaymentExistingAuthorizationModel(responseDto.authorization);
    }

    public get detailRoute(): string {
        return routeGenerator.getDebtPaymentDetailRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getDebtPaymentUpdateRoutePath(this.id);
    }
}