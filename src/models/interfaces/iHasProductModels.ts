import type { ProductBasicModel } from "../productModels";

declare global {
    interface IHasProductListModel<
                TList extends object,
                TBasic extends IHasStatsBasicModel<TAuthorization>,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasStatsListModel<TList, TBasic, TAuthorization> {
        readonly productId: number | undefined;
    }
    
    interface IHasProductDetailModel<
                TItem extends IHasProductDetailItemModel,
                TUpdateHistory extends IHasProductUpdateHistoryModel<TItemUpdateHistory>,
                TItemUpdateHistory extends IHasProductItemUpdateHistoryModel,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IHasStatsDetailModel<TUpdateHistory, TAuthorization> {
        readonly items: TItem[];
    }
    
    interface IHasProductDetailItemModel {
        readonly id: number | null;
        readonly productAmountPerUnit: number;
        readonly quantity: number;
        readonly product: ProductBasicModel | null;
        readonly productAmount: number;
    }
    
    interface IHasProductUpsertModel<
                TUpsert extends object,
                TUpsertItem extends IHasProductUpsertItemModel<TUpsertItem>,
                TUpsertPhoto extends IUpsertPhotoModel<TUpsertPhoto>>
            extends
                IHasStatsUpsertModel<TUpsert>,
                IHasMultiplePhotoUpsertModel<TUpsertPhoto> {
        readonly items: TUpsertItem[];
    }
    
    interface IHasProductUpsertItemModel<TUpsertItemModel extends object>
            extends IClonableModel<TUpsertItemModel> {
        readonly id: number | null;
        readonly productAmountPerUnit: number;
        readonly quantity: number;
        readonly product: ProductBasicModel,
        readonly hasBeenChanged: boolean;
        readonly hasBeenDeleted: boolean;
    }
    
    interface IHasProductUpdateHistoryModel<
                TItemUpdateHistory extends IHasProductItemUpdateHistoryModel>
            extends IHasStatsUpdateHistoryModel {
        readonly oldItems: TItemUpdateHistory[];
        readonly newItems: TItemUpdateHistory[];
    }
    
    interface IHasProductItemUpdateHistoryModel {
        readonly id: number;
        readonly productAmountPerUnit: number
        readonly quantity: number;
        readonly productName: string;
    }
}

export { };