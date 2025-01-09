declare global {
    export namespace ResponseDtos.Brand {
        type Minimal = {
            id: number;
            name: string;
        };

        type List = Implements<IUpsertableList<Basic, ExistingAuthorization>, {
            pageCount: number;
            items: Basic[];
        }>;
        
        type Basic = Implements<IUpsertableBasic<ExistingAuthorization>, {
            id: number;
            name: string;
            thumbnailUrl: string | null;
            authorization: ExistingAuthorization;
        }>;
        
        type Detail = Implements<IUpsertableDetail<ExistingAuthorization>, {
            id: number;
            name: string;
            website: string | null;
            socialMediaUrl: string | null;
            phoneNumber: string | null;
            email: string | null;
            address: string | null;
            createdDateTime: string;
            thumbnailUrl: string | null;
            country: ResponseDtos.Country.Single | null;
            authorization: ExistingAuthorization;
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