import { Gender } from "@/services/dtos/enums";
import { DateInputModel } from "../dateTime/dateInputModel";
import { AbstractClonableModel } from "@models/baseModels";

export class UserPersonalInformationUpsertModel
        extends AbstractClonableModel<UserPersonalInformationUpsertModel> {
    public readonly firstName: string = "";
    public readonly middleName: string = "";
    public readonly lastName: string = "";
    public readonly fullName: string = "";
    public readonly gender: Gender = Gender.Male;
    public readonly birthday: DateInputModel = new DateInputModel();
    public readonly phoneNumber: string = "";
    public readonly email: string = "";
    public readonly avatarUrl: string | null = null;
    public readonly avatarFile : string | null = null;
    public readonly avatarChanged: boolean = false;
    
    constructor(responseDto?: ResponseDtos.User.PersonalInformation) {
        super();

        if (responseDto) {
            this.firstName = responseDto.firstName;
            this.middleName = responseDto.middleName || "";
            this.lastName = responseDto.lastName;
            this.fullName = responseDto.fullName;
            this.gender = responseDto.gender;
            this.birthday = this.birthday.fromResponseDto(responseDto.birthday);
            this.phoneNumber = responseDto.phoneNumber || "";
            this.email = responseDto.email || "";
            this.avatarUrl = responseDto.avatarUrl;
        }
    }

    public toRequestDto(): RequestDtos.User.UpsertPersonalInformation {
        return {
            firstName: this.firstName,
            middleName: this.middleName || null,
            lastName: this.lastName,
            gender: this.gender,
            birthday: this.birthday.toRequestDto(),
            phoneNumber: this.phoneNumber || null,
            email: this.email || null,
            avatarFile: this.avatarFile || null,
            avatarChanged: true
        };
    }
}