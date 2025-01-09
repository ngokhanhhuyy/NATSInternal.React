declare global {
    interface IRevenueListModel<
                TBasic extends IRevenueBasicModel<TAuthorization>,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasCustomerListModel<TBasic, TAuthorization> {
    }

    interface IRevenueBasicModel<TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasCustomerBasicModel<TAuthorization> {
        readonly amountAfterVat: number;
    }
}

export { };