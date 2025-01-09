declare global {
    namespace RequestDtos {
        namespace Consultant {
            type List = PartialOptionalImplements<IHasCustomerList, {
                sortingByAscending: boolean;
                sortingByField: string;
                monthYear: RequestDtos.List.MonthYear;
                customerId: number;
                createdUserId: number;
                page: number;
                resultsPerPage: number;
            }>;
            
            type Upsert = Implements<IHasCustomerUpsert, {
                amountBeforeVat: number;
                vatAmount: number;
                note: string | null;
                statsDateTime: string | null;
                customerId: number;
                updatedReason: string | null;
            }>;
        }
    }
}

export { };