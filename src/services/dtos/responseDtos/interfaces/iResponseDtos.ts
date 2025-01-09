declare global {
    namespace ResponseDtos {
        interface IBasic {
            id: number;
        }
        
        interface IList<TBasic extends IBasic> {
            pageCount: number;
            items: TBasic[];
        }

        interface IInitial {
            displayName: string;
        }

        interface IMinimal {
            id: number;
            name: string;
        }

        interface ISortableInitial {
            listSortingOptions: ResponseDtos.List.SortingOptions;
        }
    }
}

export { };