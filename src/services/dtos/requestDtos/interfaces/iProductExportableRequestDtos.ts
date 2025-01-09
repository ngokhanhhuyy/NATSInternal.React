declare global {
    namespace RequestDtos {
        interface IExportProductList extends IHasProductList, IHasCustomerList {
        }

        interface IExportProductUpsert<
                TItem extends IExportProductUpsertItem,
                TPhoto extends IUpsertPhoto>
            extends
                IHasProductUpsert<TItem, TPhoto>,
                IHasCustomerUpsert {
        }

        interface IExportProductUpsertItem extends IHasProductUpsertItem {
            vatAmountPerUnit: number;
        }
    }
}

export { };