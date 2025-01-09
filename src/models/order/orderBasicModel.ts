import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { OrderExistingAuthorizationModel } from "./orderExistingAuthorizationModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class OrderBasicModel
        implements IHasCustomerBasicModel<OrderExistingAuthorizationModel> {
    public readonly id: number; 
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly amount: number;
    public readonly isLocked: boolean;
    public readonly customer: CustomerBasicModel;
    public readonly authorization: OrderExistingAuthorizationModel | null;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Order.Basic) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.amount = responseDto.amount;
        this.isLocked = responseDto.isLocked;
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.authorization = responseDto.authorization &&
            new OrderExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = routeGenerator.getOrderDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getOrderUpdateRoutePath(this.id);
    }
}