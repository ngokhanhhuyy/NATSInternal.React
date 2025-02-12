import { DebtPaymentExistingAuthorizationModel }
    from "./debtPaymentExistingAuthorizationModel";
import { DebtPaymentUpdateHistoryModel }
    from "./debtPaymentUpdateHistory/debtPaymentUpdateHistoryModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { UserBasicModel } from "../user/userBasicModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class DebtPaymentDetailModel implements IDebtDetailModel<
        DebtPaymentUpdateHistoryModel,
        DebtPaymentExistingAuthorizationModel> {
    public id: number;
    public amount: number;
    public note: string | null;
    public statsDateTime: DateTimeDisplayModel;
    public createdDateTime: DateTimeDisplayModel;
    public isLocked: boolean;
    public customer: CustomerBasicModel;
    public createdUser: UserBasicModel;
    public authorization: DebtPaymentExistingAuthorizationModel;
    public updateHistories: DebtPaymentUpdateHistoryModel[];

    constructor(responseDto: ResponseDtos.DebtPayment.Detail) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.note = responseDto.note;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.authorization = new DebtPaymentExistingAuthorizationModel(
            responseDto.authorization);
        this.updateHistories = responseDto.updateHistories
            ?.map(uh => new DebtPaymentUpdateHistoryModel(uh))
            ?? [];
    }

    public get detailRoute(): string {
        return routeGenerator.getDebtPaymentDetailRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getDebtPaymentUpdateRoutePath(this.id);
    }
}