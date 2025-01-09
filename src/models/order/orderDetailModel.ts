import { OrderDetailItemModel } from "./orderItem/orderDetailItemModel";
import { OrderDetailPhotoModel } from "./orderPhoto/orderDetailPhotoModel";
import { OrderUpdateHistoryModel } from "./orderUpdateHistory/orderUpdateHistoryModel";
import { OrderItemUpdateHistoryModel } from "./orderUpdateHistory/orderItemUpdateHistoryModel";
import { OrderExistingAuthorizationModel } from "./orderExistingAuthorizationModel";
import { CustomerBasicModel } from "../customer/customerBasicModel";
import { UserBasicModel } from "../user/userBasicModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class OrderDetailModel implements IExportProductDetailModel<
        OrderDetailItemModel,
        OrderUpdateHistoryModel,
        OrderItemUpdateHistoryModel,
        OrderExistingAuthorizationModel> {
    public readonly id: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly amountBeforeVat: number;
    public readonly vatAmount: number;
    public readonly note: string;
    public readonly isLocked: boolean;
    public readonly items: OrderDetailItemModel[];
    public readonly customer: CustomerBasicModel;
    public readonly createdUser: UserBasicModel;
    public readonly photos: OrderDetailPhotoModel[];
    public readonly updateHistories: OrderUpdateHistoryModel[];
    public readonly authorization: OrderExistingAuthorizationModel;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Order.Detail) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.amountBeforeVat = responseDto.amountBeforeVat;
        this.vatAmount = responseDto.vatAmount;
        this.note = responseDto.note;
        this.isLocked = responseDto.isLocked;
        this.items = responseDto.items?.map(i => new OrderDetailItemModel(i)) ?? [];
        this.customer = new CustomerBasicModel(responseDto.customer);
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.photos = responseDto.photos?.map(p => new OrderDetailPhotoModel(p)) ?? [];
        this.updateHistories = responseDto.updateHistories
            ?.map(uh => new OrderUpdateHistoryModel(uh)) ?? [];
        this.authorization = new OrderExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = routeGenerator.getOrderDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getOrderUpdateRoutePath(this.id);
    }

    public get productAmountBeforeVat(): number {
        let amount: number = 0;
        this.items.forEach(i => amount += i.productAmountPerUnit * i.quantity);
        return amount;
    }

    public get productVatAmount(): number {
        let amount: number = 0;
        this.items.forEach(i => amount+= i.vatAmountPerUnit * i.quantity);
        return amount;
    }

    public get amountAfterVat(): number {
        return this.productAmountBeforeVat + this.productVatAmount;
    }
}