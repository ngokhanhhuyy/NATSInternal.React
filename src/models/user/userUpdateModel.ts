import { AbstractClonableModel } from "../baseModels";
import { UserPersonalInformationUpsertModel } from "./userPersonalInformationUpsertModel";
import { UserUserInformationUpsertModel } from "./userUserInformationUpsertModel";
import { UserDetailAuthorizationModel } from "./userDetailAuthorizationModel";

export class UserUpdateModel extends AbstractClonableModel<UserUpdateModel> {
    public readonly id: number = 0;
    public readonly personalInformation: UserPersonalInformationUpsertModel;
    public readonly userInformation: UserUserInformationUpsertModel;
    public readonly authorization: UserDetailAuthorizationModel | null;

    constructor(roleOptions: ResponseDtos.Role.Minimal[]) {
        super();
        this.personalInformation = new UserPersonalInformationUpsertModel();
        this.userInformation = new UserUserInformationUpsertModel(roleOptions);
        this.authorization = null;
    }

    fromResponseDto(detail: ResponseDtos.User.Detail): UserUpdateModel {
        return this.from({
            id: detail.id,
            personalInformation: this.personalInformation
                .fromResponseDto(detail.personalInformation),
            userInformation: this.userInformation.fromResponseDto(detail.userInformation),
            authorization: new UserDetailAuthorizationModel(detail.authorization)
        });
    }

    public toRequestDto(): RequestDtos.User.Update {
        return {
            personalInformation: this.personalInformation.toRequestDto(),
            userInformation: this.userInformation.toRequestDto()
        };
    }
}