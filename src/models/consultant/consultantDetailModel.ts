import { ConsultantExistingAuthorizationModel } from "./consultantExistingAuthorizationModel";
import { ConsultantUpdateHistoryModel } from "../consultantUpdateHistoryModels";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { UserBasicModel } from "../user/userBasicModel";
import { DateTimeDisplayModel } from "../dateTimeModels";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class ConsultantDetailModel implements IHasCustomerDetailModel<
        ConsultantUpdateHistoryModel,
        ConsultantExistingAuthorizationModel> {
    public id: number;
    public amountBeforeVat: number;
    public vatAmount: number;
    public note: string | null;
    public statsDateTime: DateTimeDisplayModel;
    public createdDateTime: DateTimeDisplayModel;
    public isLocked: boolean;
    public customer: CustomerBasicModel;
    public createdUser: UserBasicModel;
    public authorization: ConsultantExistingAuthorizationModel;
    public updateHistories: ConsultantUpdateHistoryModel[] | null;
    public detailRoute: string;
    public updateRoute: string;

    constructor(responseDto: ResponseDtos.Consultant.Detail) {
        this.id = responseDto.id;
        this.amountBeforeVat = responseDto.amountBeforeVat;
        this.vatAmount = responseDto.vatAmount;
        this.note = responseDto.note;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.authorization = new ConsultantExistingAuthorizationModel(
            responseDto.authorization);
        this.updateHistories = responseDto.updateHistories &&
            responseDto.updateHistories.map(uh => new ConsultantUpdateHistoryModel(uh));
        this.detailRoute = routeGenerator.getConsultantDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getConsultantUpdateRoutePath(this.id);
    }

    public get lastUpdatedDateTime(): DateTimeDisplayModel | null {
        if (this.updateHistories?.length) {
            return this.updateHistories[this.updateHistories.length - 1].updatedDateTime;
        }

        return null;
    }

    public get lastUpdatedUser(): UserBasicModel | null {
        if (this.updateHistories?.length) {
            return this.updateHistories[this.updateHistories.length - 1].updatedUser;
        }

        return null;
    }
}