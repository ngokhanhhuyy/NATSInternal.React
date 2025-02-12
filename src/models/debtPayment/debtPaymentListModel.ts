import { AbstractClonableModel } from "../baseModels";
import { DebtPaymentBasicModel } from "./debtPaymentBasicModel";
import type {
    DebtPaymentExistingAuthorizationModel
} from "./debtPaymentExistingAuthorizationModel";
import { ListMonthYearModel } from "../list/listMonthYearModel";
import { ListMonthYearOptionsModel } from "../list/listMonthYearOptionsModel";
import { ListSortingOptionsModel } from "../list/listSortingOptionsModel";
import { useRouteGenerator } from "@/router/routeGenerator";

type InitialResponseDto = ResponseDtos.Expense.Initial;
type ListRequestDto = RequestDtos.Expense.List;

const routeGenerator = useRouteGenerator();

export class DebtPaymentListModel
        extends AbstractClonableModel<DebtPaymentListModel>
        implements IHasStatsListModel<
            DebtPaymentListModel,
            DebtPaymentBasicModel,
            DebtPaymentExistingAuthorizationModel> {
    public readonly sortingByAscending: boolean | undefined;
    public readonly sortingByField: string | undefined;
    public readonly monthYear: ListMonthYearModel | undefined;
    public readonly createdUserId: number | undefined;
    public readonly page: number = 1;
    public readonly resultsPerPage: number = 15;
    public readonly items: DebtPaymentBasicModel[] = [];
    public readonly pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string = routeGenerator.getDebtPaymentCreateRoutePath();

    constructor(initialResponseDto?: InitialResponseDto, requestDto?: ListRequestDto) {
        super();
        
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

    public fromListResponseDto(list: ResponseDtos.DebtPayment.List) {
        return this.from({
            pageCount: list.pageCount,
            items: list.items?.map(i => new DebtPaymentBasicModel(i)) ?? []
        });
    }

    public toRequestDto(): RequestDtos.DebtPayment.List {
        return {
            sortingByAscending: this.sortingByAscending,
            sortingByField: this.sortingByField,
            monthYear: this.monthYear?.toRequestDto(),
            createdUserId: this.createdUserId,
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}