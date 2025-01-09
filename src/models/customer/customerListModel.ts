import { AbstractClonableModel } from "../baseModels";
import { CustomerBasicModel } from "./customerBasicModel";
import { ListSortingOptionsModel } from "../list/listSortingOptionsModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

type InitialResponseDto = ResponseDtos.Customer.Initial;
type ListRequestDto = RequestDtos.Customer.List;

export class CustomerListModel
        extends AbstractClonableModel<CustomerListModel>
        implements ICreatorTrackableListModel<CustomerBasicModel> {
    public readonly sortingByAscending: boolean | undefined;
    public readonly sortingByField: string | undefined;
    public readonly searchByContent: string = "";
    public readonly createdUserId: number | undefined;
    public readonly page: number = 1;
    public readonly resultsPerPage: number = 15;
    public readonly pageCount: number = 0;
    public readonly items: CustomerBasicModel[] = [];
    public readonly hasRemainingDebtAmountOnly: boolean = false;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string = routeGenerator.getCustomerCreateRoutePath();

    constructor(initialResponseDto?: InitialResponseDto, requestDto?: ListRequestDto) {
        super();

        if (initialResponseDto) {
            const sortingOptions = initialResponseDto.listSortingOptions;
            this.sortingOptions = new ListSortingOptionsModel(sortingOptions);
            this.sortingByField = this.sortingOptions.defaultFieldName;
            this.sortingByAscending = this.sortingOptions.defaultAscending;
            this.canCreate = initialResponseDto.creatingPermission;
        }

        if (requestDto) {
            this.sortingByAscending = requestDto.sortingByAscending;
            this.sortingByField = requestDto.sortingByField;
            this.searchByContent = requestDto.searchByContent ?? this.searchByContent;
            this.createdUserId = requestDto.createdUserId;
            this.page = requestDto.page ?? this.page;
            this.resultsPerPage = requestDto.resultsPerPage ?? this.resultsPerPage;
            this.hasRemainingDebtAmountOnly = requestDto.hasRemainingDebtAmountOnly ??
                this.hasRemainingDebtAmountOnly;
        }
    }

    public fromListResponseDto(responseDto: ResponseDtos.Customer.List): CustomerListModel {
        return this.from({
            pageCount: responseDto.pageCount,
            items: responseDto.items?.map(dto => new CustomerBasicModel(dto)) ?? [],
        });

    }

    public toRequestDto(): RequestDtos.Customer.List {
        return {
            sortingByField: this.sortingByField,
            sortingByAscending: this.sortingByAscending,
            searchByContent: this.searchByContent || undefined,
            createdUserId: this.createdUserId,
            page: this.page,
            resultsPerPage: this.resultsPerPage,
            hasRemainingDebtAmountOnly: this.hasRemainingDebtAmountOnly
        };
    }
}