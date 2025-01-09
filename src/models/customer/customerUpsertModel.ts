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

    fromResponseDto(responseDto: ResponseDtos.Customer.Detail): CustomerUpsertModel {
        return this.from({
            id: responseDto.id,
            firstName: responseDto.firstName,
            middleName: responseDto.middleName || "",
            lastName: responseDto.lastName,
            nickName: responseDto.nickName || "",
            gender: responseDto.gender,
            birthday: this.birthday.fromResponseDto(responseDto.birthday),
            phoneNumber: responseDto.phoneNumber || "",
            zaloNumber: responseDto.zaloNumber || "",
            facebookUrl: responseDto.facebookUrl || "",
            email: responseDto.email || "",
            address: responseDto.address || "",
            note: responseDto.note || "",
            canDelete: responseDto.authorization.canDelete
        });
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