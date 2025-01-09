declare global {
    namespace RequestDtos {
        namespace Supply {
            type UpsertItem = Implements<IHasProductUpsertItem, {
                id: number | null;
                productAmountPerUnit: number;
                quantity: number;
                productId: number;
                hasBeenChanged: boolean;
                hasBeenDeleted: boolean;
            }>;
        }
    }
}

export { };