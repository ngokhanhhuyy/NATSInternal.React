import { AbstractClonableModel } from "../baseModels";
import { SupplyBasicModel } from "./supplyBasicModel";
import { SupplyExistingAuthorizationModel } from "./supplyExistingAuthorizationModel";
import { ListSortingOptionsModel } from "../list/listSortingOptionsModel";
import { ListMonthYearOptionsModel } from "../list/listMonthYearOptionsModel";
import { ListMonthYearModel } from "../list/listMonthYearModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class SupplyListModel
        extends AbstractClonableModel<SupplyListModel>
        implements IHasProductListModel<
            SupplyListModel,
            SupplyBasicModel,
            SupplyExistingAuthorizationModel> {
    public sortingByAscending: boolean | undefined;
    public sortingByField: string | undefined;
    public monthYear: ListMonthYearModel | undefined;
    public createdUserId: number | undefined;
    public productId: number | undefined;
    public page: number = 1;
    public resultsPerPage: number = 15;
    public items: SupplyBasicModel[] = [];
    public pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute = routeGenerator.getSupplyCreateRoutePath();

    constructor(
            listResponseDto: ResponseDtos.Supply.List,
            initialResponseDto?: ResponseDtos.Supply.Initial,
            requestDto?: RequestDtos.Supply.List) {
        super();

        this.pageCount = listResponseDto.pageCount;
        this.items = listResponseDto.items.map(dto => new SupplyBasicModel(dto));
        
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

    public fromListResponseDto(list: ResponseDtos.Supply.List) {
        return this.from({
            pageCount: list.pageCount,
            items: list.items?.map(i => new SupplyBasicModel(i)) ?? []
        });
    }

    public toRequestDto(): RequestDtos.Supply.List {
        return {
            sortingByAscending: this.sortingByAscending,
            sortingByField: this.sortingByField,
            monthYear: this.monthYear?.toRequestDto(),
            createdUserId: this.createdUserId,
            productId: this.productId,
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}