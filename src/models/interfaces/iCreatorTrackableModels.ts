import type { UserBasicModel } from "../userModels";

declare global {
    interface ICreatorTrackableListModel<TBasic extends IBasicModel>
            extends ISortableListModel<TBasic> {
        readonly createdUserId: number | undefined;
    }

    interface ICreatorTrackableDetailModel<
                TAuthorization extends IUpsertableExistingAuthorizationModel>
            extends IUpsertableDetailModel<TAuthorization> {
        readonly createdUser: UserBasicModel;
    }
}

export { };