declare global {
    namespace ResponseDtos {
        interface IHasProductDetail<
                    TItem extends IHasProductDetailItem,
                    TPhoto extends IDetailPhoto,
                    TUpdateHistory
                        extends IHasProductUpdateHistory<TItemUpdateHistory>,
                    TItemUpdateHistory extends IHasProductItemUpdateHistory,
                    TAuthorization extends IHasStatsExistingAuthorization>
                extends
                    IHasStatsDetail<TUpdateHistory, TAuthorization>,
                    IHasMultiplePhotosDetail<TPhoto>{
            items: TItem[];
        }
        
        interface IHasProductDetailItem {
            id: number;
            productAmountPerUnit: number;
            quantity: number;
            product: ResponseDtos.Product.Basic;
        }
        
        interface IHasProductUpdateHistory<
                    TItemUpdateHistory extends IHasProductItemUpdateHistory>
                extends IHasStatsUpdateHistory {
            oldItems: TItemUpdateHistory[] | null;
            newItems: TItemUpdateHistory[] | null;
        }
        
        interface IHasProductItemUpdateHistory {
            id: number;
            productAmountPerUnit: number;
            quantity: number;
            productName: string;
        }
    }
}

export { };