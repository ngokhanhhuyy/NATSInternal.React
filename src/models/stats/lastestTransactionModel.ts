import { TransactionType, TransactionDirection } from "@/services/dtos/enums";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class LastestTransactionModel {
    public readonly id: number;
    public readonly direction: TransactionDirection;
    public readonly type: TransactionType;
    public readonly amount: number;
    public readonly statsDateTime: DateTimeDisplayModel;

    constructor(responseDto: ResponseDtos.Stats.LastestTransaction) {
        this.id = responseDto.id;
        this.direction = responseDto.direction;
        this.type = responseDto.type;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
    }

    public get detailRoute(): string {
        const detailRoutePathGetters: { [key in TransactionType]: (id: number) => string } = {
            [TransactionType.Expense]: routeGenerator.getExpenseDetailRoutePath,
            [TransactionType.Supply]: routeGenerator.getSupplyDetailRoutePath,
            [TransactionType.Order]: routeGenerator.getOrderDetailRoutePath,
            [TransactionType.Treatment]: routeGenerator.getTreatmentDetailRoutePath,
            [TransactionType.Consultant]: routeGenerator.getConsultantDetailRoutePath,
            [TransactionType.DebtIncurrence]: routeGenerator.getDebtIncurrenceDetailRoutePath,
            [TransactionType.DebtPayment]: routeGenerator.getDebtPaymentDetailRoutePath
        };
        
        return detailRoutePathGetters[this.type](this.id);
    }
}