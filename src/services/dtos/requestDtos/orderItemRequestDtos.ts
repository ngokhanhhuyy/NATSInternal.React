declare global {
    namespace RequestDtos {
        namespace Order {
            type UpsertItem = Implements<IExportProductUpsertItem, {
                id: number | null;
                productAmountPerUnit: number;
                vatAmountPerUnit: number;
                quantity: number;
                productId: number;
                hasBeenChanged: boolean;
                hasBeenDeleted: boolean;
            }>;
        }
    }
}
export { };