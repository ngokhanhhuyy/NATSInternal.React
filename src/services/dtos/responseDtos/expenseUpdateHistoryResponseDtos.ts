import type { ExpenseCategory } from "../enums";

declare global {
    namespace ResponseDtos.Expense {
        type UpdateHistory = Implements<IUpdateHistory, {
            updatedDateTime: string;
            updatedUser: ResponseDtos.User.Basic;
            updatedReason: string;
            oldStatsDateTime: string;
            oldAmount: number;
            oldCategory: ExpenseCategory;
            oldNote: string | null;
            oldPayeeName: string;
            newStatsDateTime: string;
            newAmount: number;
            newCategory: ExpenseCategory;
            newNote: string | null;
            newPayeeName: string;
        }>;
    }
}

export { };