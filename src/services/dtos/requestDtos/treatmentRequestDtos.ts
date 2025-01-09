declare global {
    namespace RequestDtos {
        namespace Treatment {
            type List = PartialOptionalImplements<IHasProductList, {
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
                serviceAmountBeforeVat: number;
                serviceVatFactor: number;
                note: string | null;
                customerId: number | null;
                therapistId: number | null;
                items: UpsertItem[];
                photos: UpsertPhoto[] | null;
                updatedReason: string | null;
            }>;
        }
    }
}

export { };