import { AbstractClonableModel } from "../baseModels";

export class UserPasswordChangeModel extends AbstractClonableModel<UserPasswordChangeModel> {
    public readonly currentPassword: string = "";
    public readonly newPassword: string = "";
    public readonly confirmationPassword: string = "";

    public toRequestDto(): RequestDtos.User.PasswordChange {
        return {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
            confirmationPassword: this.confirmationPassword
        };
    }
}