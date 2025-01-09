declare global {
    namespace ResponseDtos.Order {
        type UpdateHistory = Implements<IExportProductUpdateHistory<ItemUpdateHistory>, {
            updatedDateTime: string;
            updatedUser: ResponseDtos.User.Basic;
            updatedReason: string;
            oldStatsDateTime: string;
            oldNote: string | null;
            oldItems: ItemUpdateHistory[] | null;
            newStatsDateTime: string;
            newNote: string | null;
            newItems: ItemUpdateHistory[] | null;
        }>;
        
        type ItemUpdateHistory = Implements<IHasProductItemUpdateHistory, {
            id: number;
            productAmountPerUnit: number;
            vatAmountPerUnit: number;
            quantity: number;
            productName: string;
        }>;
    }
}

export { };