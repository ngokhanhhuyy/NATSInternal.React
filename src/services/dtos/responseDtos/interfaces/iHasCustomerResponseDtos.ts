declare global {
    namespace ResponseDtos {
        interface IHasCustomerBasic<TAuthorization extends IHasStatsExistingAuthorization>
                extends IHasStatsBasic<TAuthorization> {
            customer: ResponseDtos.Customer.Basic;
        }
    
        interface IHasCustomerList<
                TBasic extends IHasCustomerBasic<TAuthorization>,
                TAuthorization extends IHasStatsExistingAuthorization>
            extends IHasStatsList<TBasic, TAuthorization> {
        }
    
        interface IHasCustomerDetail<
                    TUpdateHistory extends IHasStatsUpdateHistory,
                    TAuthorization extends IHasStatsExistingAuthorization>
                extends IHasStatsDetail<TUpdateHistory, TAuthorization> {
            customer: ResponseDtos.Customer.Basic;
        }
    }
}

export { };