declare global {
    namespace RequestDtos {
        namespace Supply {
            type List = PartialOptionalImplements<IHasProductList, {
                sortingByAscending: boolean;
                sortingByField: string;
                monthYear: RequestDtos.List.MonthYear;
                createdUserId: number;
                productId: number;
                page: number;
                resultsPerPage: number;
            }>;
            
            type Upsert = Implements<IHasProductUpsert<UpsertItem, UpsertPhoto>, {
                statsDateTime: string | null;
                shipmentFee: number;
                note: string | null;
                items: UpsertItem[];
                photos: UpsertPhoto[] | null;
                updatedReason: string | null;
            }>;
        }
    }
}

export { };