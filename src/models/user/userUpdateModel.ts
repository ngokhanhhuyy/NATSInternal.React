import { AbstractClonableModel } from "../baseModels";
import { UserPersonalInformationUpsertModel } from "./userPersonalInformationUpsertModel";
import { UserUserInformationUpsertModel } from "./userUserInformationUpsertModel";
import { UserDetailAuthorizationModel } from "./userDetailAuthorizationModel";

export class UserUpdateModel extends AbstractClonableModel<UserUpdateModel> {
    public readonly id: number = 0;
    public readonly personalInformation: UserPersonalInformationUpsertModel;
    public readonly userInformation: UserUserInformationUpsertModel;
    public readonly authorization: UserDetailAuthorizationModel | null;

    constructor(
            detailResponseDto: ResponseDtos.User.Detail,
            roleOptionResponseDtos: ResponseDtos.Role.Minimal[]) {
        super();
        this.personalInformation = new UserPersonalInformationUpsertModel(
            detailResponseDto.personalInformation);
        this.userInformation = new UserUserInformationUpsertModel(
            roleOptionResponseDtos,
            detailResponseDto.userInformation);
        this.authorization = new UserDetailAuthorizationModel(detailResponseDto.authorization);
    }

    public toRequestDto(): RequestDtos.User.Update {
        return {
            personalInformation: this.personalInformation.toRequestDto(),
            userInformation: this.userInformation.toRequestDto()
        };
    }
}