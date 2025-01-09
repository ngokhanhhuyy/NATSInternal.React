declare global {
    interface IUpsertableListModel<
                TBasic extends IUpsertableBasicModel<TAuthorization>,
                TAuthorization extends IUpsertableExistingAuthorizationModel>
            extends IPaginatedListModel<TBasic> {
        readonly canCreate: boolean | undefined;
        readonly createRoute: string;
    }
    
    interface IUpsertableBasicModel<
                TAuthorization extends IUpsertableExistingAuthorizationModel>
            extends IBasicModel {
        readonly authorization: TAuthorization | null;
        readonly detailRoute: string;
        readonly updateRoute: string;
    }
    
    interface IUpsertableDetailModel<
                TAuthorization extends IUpsertableExistingAuthorizationModel> {
        readonly id: number;
        readonly authorization: TAuthorization;
        readonly detailRoute: string;
        readonly updateRoute: string;
    }
    
    interface IUpsertableExistingAuthorizationModel {
        readonly canEdit: boolean;
        readonly canDelete: boolean;
    }
}

export { };