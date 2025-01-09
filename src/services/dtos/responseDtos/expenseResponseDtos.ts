import type { ExpenseCategory } from "../enums";

declare global {
    namespace ResponseDtos.Expense {
        type Basic = Implements<
                IHasStatsBasic<ExistingAuthorization> & IHasThumbnailBasic, {
            id: number;
            amount: number;
            statsDateTime: string;
            category: ExpenseCategory;
            isLocked: boolean;
            thumbnailUrl: string | null;
            authorization: ExistingAuthorization | null;
        }>;
        
        type List = Implements<IHasStatsList<
                    Basic,
                    ExistingAuthorization>, {
            pageCount: number;
            items: Basic[];
            monthYearOptions: ResponseDtos.List.MonthYear[];
        }>;
        
        type Detail = Implements<
                IHasStatsDetail<UpdateHistory, ExistingAuthorization> &
                IHasMultiplePhotosDetail<DetailPhoto>, {
            id: number;
            amountAfterVat: number;
            statsDateTime: string;
            createdDateTime: string;
            category: ExpenseCategory;
            note: string;
            isLocked: boolean;
            createdUser: ResponseDtos.User.Basic;
            payee: Payee;
            photos: DetailPhoto[] | null;
            authorization: ExistingAuthorization;
            updateHistories: UpdateHistory[] | null;
        }>;
        
        type CreatingAuthorization = Implements<IHasStatsCreatingAuthorization, {
            canSetStatsDateTime: boolean;
        }>;
        
        type ExistingAuthorization = Implements<IHasStatsExistingAuthorization, {
            canEdit: boolean;
            canDelete: boolean;
            canSetStatsDateTime: boolean;
        }>;

        type Initial = Implements<IHasStatsInitial<CreatingAuthorization>, {
            displayName: string;
            listSortingOptions: ResponseDtos.List.SortingOptions;
            listMonthYearOptions: ResponseDtos.List.MonthYearOptions;
            creatingAuthorization: CreatingAuthorization | null;
            creatingPermission: boolean;
        }>;
    }
}

export { };