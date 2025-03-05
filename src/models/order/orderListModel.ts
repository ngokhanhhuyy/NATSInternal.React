import { AbstractClonableModel } from "../baseModels";
import { OrderBasicModel } from "./orderBasicModel";
import type { OrderExistingAuthorizationModel } from "./orderExistingAuthorizationModel";
import { ListMonthYearModel } from "../list/listMonthYearModel";
import { ListMonthYearOptionsModel } from "../list/listMonthYearOptionsModel";
import { ListSortingOptionsModel } from "../list/listSortingOptionsModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class OrderListModel
        extends AbstractClonableModel<OrderListModel>
        implements IExportProductListModel<
            OrderListModel,
            OrderBasicModel,
            OrderExistingAuthorizationModel> {
    public readonly sortingByAscending: boolean | undefined;
    public readonly sortingByField: string | undefined;
    public readonly monthYear: ListMonthYearModel | undefined;
    public readonly createdUserId: number | undefined;
    public readonly customerId: number | undefined;
    public readonly productId: number | undefined;
    public readonly page: number = 1;
    public readonly resultsPerPage: number = 15;
    public readonly items: OrderBasicModel[] = [];
    public readonly pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string = routeGenerator.getOrderCreateRoutePath();

    constructor(
            listResponseDto: ResponseDtos.Order.List,
            initialResponseDto?: ResponseDtos.Order.Initial,
            requestDto?: RequestDtos.Order.List) {
        super();

        this.pageCount = listResponseDto.pageCount;
        this.items = listResponseDto.items.map(dto => new OrderBasicModel(dto));
        
        if (initialResponseDto) {
            const sortingOptions = initialResponseDto.listSortingOptions;
            const monthyearOptions = initialResponseDto.listMonthYearOptions;
            this.sortingOptions = new ListSortingOptionsModel(sortingOptions);
            this.sortingByField = this.sortingOptions.defaultFieldName;
            this.sortingByAscending = this.sortingOptions.defaultAscending;
            this.monthYearOptions = new ListMonthYearOptionsModel(monthyearOptions);
            this.canCreate = initialResponseDto.creatingPermission;
        }

        if (requestDto) {
            this.sortingByAscending = requestDto.sortingByAscending;
            this.sortingByField = requestDto.sortingByField;
            this.createdUserId = requestDto.createdUserId;
            this.customerId = requestDto.customerId;
            this.productId = requestDto.productId;
            this.page = requestDto.page ?? this.page;
            this.resultsPerPage = requestDto.resultsPerPage ?? this.resultsPerPage;

            if (requestDto.monthYear) {
                if (this.monthYearOptions && this.monthYearOptions.options.length) {
                    this.monthYear = this.monthYearOptions?.options.find(myo =>
                        myo.year === requestDto.monthYear?.year &&
                        myo.month === requestDto.monthYear?.month);
                }
            }
        }
    }
    
    public fromListResponseDto(responseDto: ResponseDtos.Order.List) {
        return this.from({
            pageCount: responseDto.pageCount,
            items: responseDto.items?.map(i => new OrderBasicModel(i)) ?? []
        });
    }

    public toRequestDto(): RequestDtos.Order.List {
        return {
            sortingByAscending: this.sortingByAscending,
            sortingByField: this.sortingByField,
            monthYear: this.monthYear?.toRequestDto(),
            createdUserId: this.createdUserId,
            productId: this.productId,
            customerId: this.customerId,
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}