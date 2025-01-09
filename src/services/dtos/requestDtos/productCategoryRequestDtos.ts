declare global {
    namespace RequestDtos {
        namespace ProductCategory {
            type List = PartialOptionalImplements<IPaginatedList, {
                page: number;
                resultsPerPage: number;
            }>;
    
            type Upsert = {
                name: string;
            }
        }
    }
}

export { };