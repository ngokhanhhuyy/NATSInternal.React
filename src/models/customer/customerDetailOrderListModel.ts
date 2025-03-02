import { AbstractClonableModel } from "../baseModels";
import { OrderBasicModel } from "../order/orderBasicModel";
import { type OrderExistingAuthorizationModel }
    from "../order/orderExistingAuthorizationModel";

export class CustomerDetailOrderListModel
        extends AbstractClonableModel<CustomerDetailOrderListModel>
        implements ICustomerDetailTransactionListModel<
            OrderBasicModel,
            OrderExistingAuthorizationModel> {
    readonly page: number = 1;
    readonly resultsPerPage: number = 5;
    readonly pageCount: number = 0;
    readonly items: Readonly<OrderBasicModel[]> = [];

    constructor(
            responseDto?: ResponseDtos.Order.List,
            requestDto?: RequestDtos.Order.List) {
        super();

        if (responseDto) {
            this.pageCount = responseDto.pageCount;
            this.items = responseDto.items.map(dto => new OrderBasicModel(dto));
        }

        if (requestDto) {
            this.page = requestDto.page ?? this.page;
            this.resultsPerPage = requestDto.resultsPerPage ?? this.resultsPerPage;
        }
    }

    public fromListResponseDto(responseDto: ResponseDtos.Order.List) {
        return this.from({
            pageCount: responseDto.pageCount,
            items: responseDto.items.map(dto => new OrderBasicModel(dto))
        });
    }

    public toRequestDto(): RequestDtos.Treatment.List {
        return {
            page: this.page,
            resultsPerPage: this.resultsPerPage,
        };
    }
}