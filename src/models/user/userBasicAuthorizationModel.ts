export class UserBasicAuthorizationModel implements IUpsertableExistingAuthorizationModel {
    public readonly canEdit: boolean;
    public readonly canChangePassword: boolean;
    public readonly canResetPassword: boolean;
    public readonly canDelete: boolean;

    constructor(responseDto: ResponseDtos.User.BasicAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canChangePassword = responseDto.canChangePassword;
        this.canResetPassword = responseDto.canResetPassword;
        this.canDelete = responseDto.canDelete;
    }
}