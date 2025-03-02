declare global {
    interface ICustomerDetailTransactionListModel<
                TBasic extends IHasCustomerBasicModel<TAuthorization>,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends
                IPaginatedListModel<TBasic>
                 { }
}

export { };