import type { ExpenseCategory } from "../enums";

declare global {
    namespace RequestDtos {
        namespace Expense {
            type List = PartialOptionalImplements<IHasStatsList, {
                sortingByAscending: boolean;
                sortingByField: string;
                monthYear: RequestDtos.List.MonthYear;
                category: ExpenseCategory;
                createdUserId: number;
                page: number;
                resultsPerPage: number;
            }>;
            
            type Upsert = Implements<IHasStatsUpsert, {
                amount: number;
                statsDateTime: string | null;
                category: ExpenseCategory;
                note: string | null;
                payeeName: string;
                photos: UpsertPhoto[] | null;
                updatedReason: string | null;
            }>;
        }
    }
}

export { };