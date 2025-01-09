declare global {
    namespace RequestDtos {
        namespace Notification {
            type List = Implements<IPaginatedList, {
                page: number;
                resultsPerPage: number;
            }>;
        }
    }
}

export { };