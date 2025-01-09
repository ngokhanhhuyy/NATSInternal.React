declare global {
    namespace ResponseDtos.DebtPayment {
        type UpdateHistory = Implements<IDebtUpdateHistory, {
            updatedDateTime: string;
            updatedUser: ResponseDtos.User.Basic;
            updatedReason: string;
            oldStatsDateTime: string;
            oldAmount: number;
            oldNote: string | null;
            newStatsDateTime: string;
            newAmount: number;
            newNote: string | null;
        }>;
    }
}

export { };