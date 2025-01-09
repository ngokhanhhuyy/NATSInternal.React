declare global {
    interface IDebtBasicModel<
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        extends IHasCustomerBasicModel<TAuthorization> { }
    
    interface IDebtListModel<
            TBasic extends IHasCustomerBasicModel<TAuthorization>,
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        extends IHasCustomerListModel<TBasic, TAuthorization> { }
    
    interface IDebtDetailModel<
                TUpdateHistory extends IDebtUpdateHistoryModel,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasCustomerDetailModel<TUpdateHistory, TAuthorization> {
        readonly amount: number;
    }
    
    interface IDebtUpsertModel
            extends IHasStatsUpsertModel, IHasCustomerUpsertModel {
        readonly amount: number;
        readonly canSetStatsDateTime: boolean;
        readonly canDelete: boolean;
    }
    
    interface IDebtUpdateHistoryModel extends IHasStatsUpdateHistoryModel {
        readonly oldAmount: number;
        readonly newAmount: number;
    }
}

export { };