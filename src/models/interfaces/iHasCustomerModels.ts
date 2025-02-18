import type { CustomerBasicModel } from "../customerModels";

declare global {
    interface IHasCustomerListModel<
                TList extends IHasStatsListModel<TList, TBasic, TAuthorization>,
                TBasic extends IHasCustomerBasicModel<TAuthorization>,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasStatsListModel<TList, TBasic, TAuthorization> {
        readonly customerId: number | undefined;
    }
    
    interface IHasCustomerBasicModel<
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasStatsBasicModel<TAuthorization> {
        readonly customer: CustomerBasicModel;
    }
    
    interface IHasCustomerDetailModel<
                TUpdateHistory extends IHasStatsUpdateHistoryModel,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasStatsDetailModel<TUpdateHistory, TAuthorization> {
        readonly customer: CustomerBasicModel;
    }
    
    interface IHasCustomerUpsertModel<TUpsert extends object>
            extends IHasStatsUpsertModel<TUpsert> {
        readonly customer: CustomerBasicModel | null;
    }
}

export { };