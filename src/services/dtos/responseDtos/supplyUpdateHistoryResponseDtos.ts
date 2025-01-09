declare global {
    namespace ResponseDtos.Supply {
        type UpdateHistory = Implements<IHasProductUpdateHistory<ItemUpdateHistory>, {
            updatedDateTime: string;
            updatedUser: ResponseDtos.User.Basic;
            updatedReason: string;
            oldStatsDateTime: string;
            oldShipmentFee: number;
            oldNote: string | null;
            oldItems: ItemUpdateHistory[] | null;
            newStatsDateTime: string;
            newShipmentFee: number;
            newNote: string | null;
            newItems: ItemUpdateHistory[] | null;
        }>;
        
        type ItemUpdateHistory = Implements<IHasProductItemUpdateHistory, {
            id: number;
            productAmountPerUnit: number;
            quantity: number;
            productName: string;
        }>;
    }
}

export { };