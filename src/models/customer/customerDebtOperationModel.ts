import { DebtOperationType } from "@/services/dtos/enums";
import { CustomerDebtOperationAuthorizationModel }
    from "./customerDebtOperationAuthorizationModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";

export class CustomerDebtOperationModel {
    public operation: DebtOperationType;
    public amount: number;
    public operatedDateTime: DateTimeDisplayModel;
    public isLocked: boolean;
    public authorization: ResponseDtos.Customer.DebtOperationAuthorization;

    constructor(responseDto: ResponseDtos.Customer.DebtOperation) {
        this.operation = responseDto.operation;
        this.amount = responseDto.amount;
        this.operatedDateTime = new DateTimeDisplayModel(responseDto.operatedDateTime);
        this.isLocked = responseDto.isLocked;
        this.authorization = new CustomerDebtOperationAuthorizationModel(
            responseDto.authorization);
    }
}