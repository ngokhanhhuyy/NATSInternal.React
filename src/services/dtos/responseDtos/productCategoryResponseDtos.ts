declare global {
    namespace ResponseDtos.ProductCategory {
        type Minimal = {
            id: number;
            name: string;
        };

        type Basic = Implements<IUpsertableBasic<ExistingAuthorization>, {
            id: number;
            name: string;
            authorization: ExistingAuthorization | null;
        }>;

        type Detail = Implements<IUpsertableBasic<ExistingAuthorization>, {
            id: number;
            name: string;
            authorization: ExistingAuthorization;
        }>;
        
        type List = Implements<IUpsertableList<Basic, ExistingAuthorization>, {
            pageCount: number;
            items: Basic[];
        }>;
        
        type ExistingAuthorization = Implements<IUpsertableExistingAuthorization, {
            canEdit: boolean;
            canDelete: boolean;
        }>;

        type Initial = Implements<IUpsertableInitial & IHasOptionsInitial<Minimal>, {
            displayName: string;
            allAsOptions: Minimal[];
            creatingPermission: boolean;
        }>;
    }
}

export { };