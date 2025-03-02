import type { ListSortingOptionsModel } from "../listSortingModels";

declare global {
    interface IPaginatedListModel<TBasic extends IBasicModel> {
        readonly page: number;
        readonly resultsPerPage: number | undefined;
        readonly pageCount: number;
        readonly items: Readonly<TBasic[]>;
    }
    
    interface ISortableListModel<TBasic extends IBasicModel>
            extends IPaginatedListModel<TBasic> {
        readonly sortingByAscending: boolean | undefined;
        readonly sortingByField: string | undefined;
        readonly sortingOptions: ListSortingOptionsModel | undefined;
    }
    
    interface IBasicModel {
        readonly id: number;
    }
}

export { };