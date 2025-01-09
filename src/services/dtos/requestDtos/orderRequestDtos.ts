declare global {
    namespace RequestDtos {
        namespace Order {
            type List = PartialOptionalImplements<IExportProductList, {
                sortingByAscending: boolean;
                sortingByField: string;
                monthYear: RequestDtos.List.MonthYear;
                createdUserId: number;
                customerId: number;
                productId: number;
                page: number;
                resultsPerPage: number;
            }>;
            
            type Upsert = Implements<IExportProductUpsert<UpsertItem, UpsertPhoto>, {
                statsDateTime: string | null;
                note: string | null;
                customerId: number;
                items: UpsertItem[];
                photos: UpsertPhoto[];
                updatedReason: string | null;
            }>;
        }
    }
}

export { };