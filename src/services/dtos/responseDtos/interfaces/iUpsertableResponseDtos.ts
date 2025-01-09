declare global {
    namespace ResponseDtos {
        interface IUpsertableBasic<TAuthorization extends IUpsertableExistingAuthorization>
                extends IBasic {
            authorization: TAuthorization | null;
        }
        
        interface IUpsertableList<
                TBasic extends IUpsertableBasic<TAuthorization>,
                TAuthorization extends IUpsertableExistingAuthorization>
            extends IList<TBasic> { }
        
        interface IUpsertableDetail<TAuthorization extends IUpsertableExistingAuthorization> {
            createdDateTime: string;
            authorization: TAuthorization | null;
        }
        
        interface IUpsertableExistingAuthorization {
            canEdit: boolean;
            canDelete: boolean;
        }

        interface IUpsertableInitial extends IInitial {
            creatingPermission: boolean;
        }
    }
}

export { };