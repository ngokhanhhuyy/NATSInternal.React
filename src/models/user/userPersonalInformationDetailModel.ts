import { Gender } from "@/services/dtos/enums";
import { DateDisplayModel } from "../dateTimeModels";
import { useAvatarUtility } from "@/utilities/avatarUtility";

export class UserPersonalInformationDetailModel {
    public readonly firstName: string;
    public readonly middleName: string | null;
    public readonly lastName: string;
    public readonly fullName: string;
    public readonly gender: Gender = Gender.Male;
    public readonly birthday: DateDisplayModel | null;
    public readonly phoneNumber: string | null;
    public readonly email: string | null;
    public readonly avatarUrl: string | null;

    constructor(responseDto: ResponseDtos.User.PersonalInformation) {
        this.firstName = responseDto.firstName;
        this.middleName = responseDto.middleName;
        this.lastName = responseDto.lastName;
        this.fullName = responseDto.fullName;
        this.gender = responseDto.gender;
        this.birthday = responseDto.birthday
            ? new DateDisplayModel(responseDto.birthday)
            : null;
        this.phoneNumber = responseDto.phoneNumber;
        this.email = responseDto.email;
        this.avatarUrl = responseDto.avatarUrl ??
            useAvatarUtility().getDefaultAvatarUrlByFullName(responseDto.fullName);
    }
}