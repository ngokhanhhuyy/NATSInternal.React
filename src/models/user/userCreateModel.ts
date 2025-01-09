import { AbstractClonableModel } from "../baseModels";
import { UserPersonalInformationUpsertModel } from "./userPersonalInformationUpsertModel";
import { UserUserInformationUpsertModel } from "./userUserInformationUpsertModel";

export class UserCreateModel extends AbstractClonableModel<UserCreateModel> {
    public readonly id: number = 0;
    public readonly userName: string = "";
    public readonly password: string = "";
    public readonly confirmationPassword: string = "";
    public readonly personalInformation: UserPersonalInformationUpsertModel;
    public readonly userInformation: UserUserInformationUpsertModel;

    constructor(roleOptionsResponseDto: ResponseDtos.Role.Minimal[]) {
        super();
        this.personalInformation = new UserPersonalInformationUpsertModel();
        this.userInformation = new UserUserInformationUpsertModel(roleOptionsResponseDto);
    }

    public toRequestDto(): RequestDtos.User.Create {
        return {
            userName: this.userName,
            password: this.password,
            confirmationPassword: this.confirmationPassword,
            personalInformation: this.personalInformation.toRequestDto(),
            userInformation: this.userInformation.toRequestDto()
        };
    }
}