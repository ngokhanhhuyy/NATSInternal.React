import { AbstractClonableModel } from "../baseModels";

export class UserPasswordResetModel extends AbstractClonableModel<UserPasswordResetModel> {
    public readonly id: number;
    public readonly newPassword: string = "";
    public readonly confirmationPassword: string = "";

    constructor(id: number) {
        super();
        this.id = id;
    }

    public toRequestDto(): RequestDtos.User.PasswordReset {
        return {
            newPassword: this.newPassword,
            confirmationPassword: this.confirmationPassword
        };
    }
}