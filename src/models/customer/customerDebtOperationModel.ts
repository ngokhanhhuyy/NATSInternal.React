import { DebtOperationType } from "@/services/dtos/enums";
import { CustomerDebtOperationAuthorizationModel }
    from "./customerDebtOperationAuthorizationModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";

export class CustomerDebtOperationModel {
    public readonly id: number;
    public readonly operation: DebtOperationType;
    public readonly amount: number;
    public readonly operatedDateTime: DateTimeDisplayModel;
    public readonly isLocked: boolean;
    public readonly authorization: ResponseDtos.Customer.DebtOperationAuthorization;

    constructor(responseDto: ResponseDtos.Customer.DebtOperation) {
        this.id = responseDto.id;
        this.operation = responseDto.operation;
        this.amount = responseDto.amount;
        this.operatedDateTime = new DateTimeDisplayModel(responseDto.operatedDateTime);
        this.isLocked = responseDto.isLocked;
        this.authorization = new CustomerDebtOperationAuthorizationModel(
            responseDto.authorization);
    }
}