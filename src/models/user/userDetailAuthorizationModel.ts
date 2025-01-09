export class UserDetailAuthorizationModel {
    public readonly canGetNote: boolean;
    public readonly canEdit: boolean;
    public readonly canEditUserPersonalInformation: boolean;
    public readonly canEditUserUserInformation: boolean;
    public readonly canAssignRole: boolean;
    public readonly canChangePassword: boolean;
    public readonly canResetPassword: boolean;
    public readonly canDelete: boolean;

    constructor(responseDto: ResponseDtos.User.DetailAuthorization) {
        this.canGetNote = responseDto.canGetNote;
        this.canEdit = responseDto.canEdit;
        this.canEditUserPersonalInformation = responseDto.canEditUserPersonalInformation;
        this.canEditUserUserInformation = responseDto.canEditUserUserInformation;
        this.canAssignRole = responseDto.canAssignRole;
        this.canChangePassword = responseDto.canChangePassword;
        this.canResetPassword = responseDto.canResetPassword;
        this.canDelete = responseDto.canDelete;
    }
}