declare global {
    namespace ResponseDtos {
        interface IDebtList<
                    TBasic extends IDebtBasic<TAuthorization>,
                    TAuthorization extends IHasStatsExistingAuthorization>
                extends IHasStatsList<TBasic, TAuthorization> {
        }
    
        interface IDebtBasic<TAuthorization extends IHasStatsExistingAuthorization>
                extends IHasCustomerBasic<TAuthorization> {
        }
    
        interface IDebtDetail<
                    TUpdateHistory extends IHasStatsUpdateHistory,
                    TAuthorization extends IHasStatsExistingAuthorization>
                extends IHasCustomerDetail<TUpdateHistory, TAuthorization> { }
        
        interface IDebtUpdateHistory
                extends IHasStatsUpdateHistory {
            oldAmount: number;
            newAmount: number;
        }
    }
}

export { };