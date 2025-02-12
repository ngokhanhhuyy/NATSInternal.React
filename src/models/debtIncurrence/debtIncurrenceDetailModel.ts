import { DebtIncurrenceExistingAuthorizationModel }
    from "./debtIncurrenceExistingAuthorizationModel";
import { DebtIncurrenceUpdateHistoryModel }
    from "./debtIncurrenceUpdateHistory/debtIncurrenceUpdateHistoryModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { UserBasicModel } from "../user/userBasicModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class DebtIncurrenceDetailModel implements IDebtDetailModel<
        DebtIncurrenceUpdateHistoryModel,
        DebtIncurrenceExistingAuthorizationModel> {
    public id: number;
    public amount: number;
    public note: string | null;
    public statsDateTime: DateTimeDisplayModel;
    public createdDateTime: DateTimeDisplayModel;
    public isLocked: boolean;
    public customer: CustomerBasicModel;
    public createdUser: UserBasicModel;
    public authorization: DebtIncurrenceExistingAuthorizationModel;
    public updateHistories: DebtIncurrenceUpdateHistoryModel[];

    constructor(responseDto: ResponseDtos.DebtIncurrence.Detail) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.note = responseDto.note;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.authorization = new DebtIncurrenceExistingAuthorizationModel(
            responseDto.authorization);
        this.updateHistories = responseDto.updateHistories
            ?.map(uh => new DebtIncurrenceUpdateHistoryModel(uh))
            ?? [];
    }

    public get detailRoute(): string {
        return routeGenerator.getDebtIncurrenceDetailRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getDebtIncurrenceUpdateRoutePath(this.id);
    }
}