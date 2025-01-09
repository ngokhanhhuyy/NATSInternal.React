declare global {
    namespace RequestDtos {
        interface IPaginatedList {
            page: number;
            resultsPerPage: number;
        }

        interface ISortablePaginatedList extends IPaginatedList {
            sortingByAscending: boolean;
            sortingByField: string;
        }

        type PartialOptionalImplements<T extends IPaginatedList, U extends T> = {
            [P in keyof U]?: U[P] | undefined;
        };
    }
}

export { };