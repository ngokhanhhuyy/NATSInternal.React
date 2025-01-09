declare global {
    namespace ResponseDtos.List {
        type SortingOptions = {
            fieldOptions: SortingByField[];
            defaultFieldName: string;
            defaultAscending: boolean;
        }
    
        type SortingByField = {
            name: string;
            displayName: string;
        }
    }
}

export { };