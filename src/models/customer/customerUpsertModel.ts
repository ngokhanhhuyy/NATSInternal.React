import { AbstractClonableModel } from "../baseModels";
import { Gender } from "@/services/dtos/enums";
import { DateInputModel } from "../dateTime/dateInputModel";

export class CustomerUpsertModel extends AbstractClonableModel<CustomerUpsertModel> {
    public readonly id: number = 0;
    public readonly firstName: string = "";
    public readonly middleName: string = "";
    public readonly lastName: string = "";
    public readonly nickName: string = "";
    public readonly gender: Gender = Gender.Male;
    public readonly birthday: DateInputModel = new DateInputModel();
    public readonly phoneNumber: string = "";
    public readonly zaloNumber: string = "";
    public readonly facebookUrl: string = "";
    public readonly email: string = "";
    public readonly address: string = "";
    public readonly note: string = "";
    public readonly introducerId: number | null = null;
    public readonly canDelete: boolean | undefined;

    constructor(responseDto?: ResponseDtos.Customer.Detail) {
        super();
        
        if (responseDto) {
            this.id = responseDto.id;
            this.firstName = responseDto.firstName;
            this.middleName = responseDto.middleName || "";
            this.lastName = responseDto.lastName;
            this.nickName = responseDto.nickName || "";
            this.gender = responseDto.gender;
            this.birthday = this.birthday.fromResponseDto(responseDto.birthday);
            this.phoneNumber = responseDto.phoneNumber || "";
            this.zaloNumber = responseDto.zaloNumber || "";
            this.facebookUrl = responseDto.facebookUrl || "";
            this.email = responseDto.email || "";
            this.address = responseDto.address || "";
            this.note = responseDto.note || "";
            this.canDelete = responseDto.authorization.canDelete;
        }
    }

    public toRequestDto(): RequestDtos.Customer.Upsert {
        return {
            firstName: this.firstName || null,
            middleName: this.middleName || null,
            lastName: this.lastName || null,
            nickName: this.nickName || null,
            gender: this.gender,
            birthday: this.birthday.toRequestDto(),
            phoneNumber: this.phoneNumber || null,
            zaloNumber: this.zaloNumber || null,
            facebookUrl: this.facebookUrl || null,
            email: this.email || null,
            address: this.address || null,
            note: this.note || null,
            introducerId: this.introducerId
        };
    }
}