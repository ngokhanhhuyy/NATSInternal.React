declare global {
    namespace RequestDtos {
        interface IHasProductList extends IHasStatsList {
            productId: number;
        }

        interface IHasProductUpsert<
                    TItem extends IHasProductUpsertItem,
                    TPhoto extends IUpsertPhoto>
                extends IHasStatsUpsert, IHasMultiplePhotosUpsert<TPhoto> {
            items: TItem[];
        }

        interface IHasProductUpsertItem {
            id: number | null;
            productAmountPerUnit: number;
            quantity: number;
            productId: number;
            hasBeenChanged: boolean;
            hasBeenDeleted: boolean;
        }
    }
}

export { };