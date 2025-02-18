declare global {
    interface IExportProductBasicModel<
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasCustomerBasicModel<TAuthorization> {
                readonly amountAfterVat: number;
    }

    interface IExportProductListModel<
            TList extends IHasStatsListModel<TList, TBasic, TAuthorization>,
            TBasic extends IHasCustomerBasicModel<TAuthorization>,
            TAuthorization extends IHasStatsExistingAuthorizationModel>
        extends
            IHasProductListModel<TList, TBasic, TAuthorization>,
            IHasCustomerListModel<TList, TBasic, TAuthorization> { }
    
    interface IExportProductDetailModel<
                TItem extends IHasProductDetailItemModel,
                TUpdateHistory
                    extends IExportProductUpdateHistoryModel<TItemUpdateHistory>,
                TItemUpdateHistory extends IExportProductItemUpdateHistoryModel,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends
                IHasProductDetailModel<
                    TItem,
                    TUpdateHistory,
                    TItemUpdateHistory,
                    TAuthorization>,
                IHasCustomerDetailModel<TUpdateHistory, TAuthorization> {
        readonly productAmountBeforeVat: number;
        readonly productVatAmount: number;
        readonly amountBeforeVat: number;
        readonly vatAmount: number;
        readonly amountAfterVat: number;
    }
    
    interface IExportProductUpsertModel<
                TUpsert extends object,
                TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>,
                TPhoto extends IUpsertPhotoModel<TPhoto>>
            extends
                IHasProductUpsertModel<TUpsert, TUpsertItem, TPhoto>,
                IHasCustomerUpsertModel<TUpsert> {
        readonly productAmountBeforeVat: number;
        readonly productVatAmount: number;
        readonly productAmountAfterVat: number;
        readonly amountBeforeVat: number;
        readonly vatAmount: number;
        readonly amountAfterVat: number;
    }
    
    interface IExportProductDetailItemModel extends IHasProductDetailItemModel {
        readonly vatAmountPerUnit: number;
    }
    
    interface IExportProductUpsertItemModel<TUpsertItemModel extends object>
            extends IHasProductUpsertItemModel<TUpsertItemModel> {
        readonly vatPercentagePerUnit: number;
        readonly vatAmountPerUnit: number;
    }
    
    interface IExportProductUpdateHistoryModel<
                TItemUpdateHistory extends IExportProductItemUpdateHistoryModel>
            extends IHasProductUpdateHistoryModel<TItemUpdateHistory> { }
    
    interface IExportProductItemUpdateHistoryModel
            extends IHasProductItemUpdateHistoryModel {
        readonly vatAmountPerUnit: number;
    }
}

export { };