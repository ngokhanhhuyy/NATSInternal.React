import type { CustomerBasicModel } from "../customerModels";

declare global {
    interface IHasCustomerListModel<
                TBasic extends IHasCustomerBasicModel<TAuthorization>,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasStatsListModel<TBasic, TAuthorization> {
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
    
    interface IHasCustomerUpsertModel extends IHasStatsUpsertModel {
        readonly customer: CustomerBasicModel | null;
    }
}

export { };