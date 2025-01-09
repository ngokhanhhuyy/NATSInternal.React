declare global {
    namespace ResponseDtos.Consultant {
        type UpdateHistory = Implements<IHasStatsUpdateHistory, {
            updatedDateTime: string;
            updatedUser: ResponseDtos.User.Basic;
            updatedReason: string;
            oldStatsDateTime: string;
            oldAmountBeforeVat: number;
            oldVatAmount: number;
            oldNote: string;
            newStatsDateTime: string;
            newAmountBeforeVat: number;
            newVatAmount: number;
            newNote: string;
        }>;
    }
}

export { };