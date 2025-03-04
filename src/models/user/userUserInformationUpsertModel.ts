import { AbstractClonableModel } from "../baseModels";
import { RoleMinimalModel } from "@models/role/roleMinimalModel";
import { DateInputModel } from "@models/dateTime/dateInputModel";

export class UserUserInformationUpsertModel
        extends AbstractClonableModel<UserUserInformationUpsertModel> {
    public readonly joiningDate: DateInputModel = new DateInputModel();
    public readonly roleName: string;
    public readonly note: string = "";
    public readonly roleOptions: RoleMinimalModel[] = [];

    constructor(
            roleOptionResponseDtos: ResponseDtos.Role.Minimal[],
            userInformationResponseDto?: ResponseDtos.User.UserInformation,) {
        super();

        this.roleOptions = roleOptionResponseDtos.map(dto => new RoleMinimalModel(dto));
        this.roleName = roleOptionResponseDtos[0].name;

        if (userInformationResponseDto) {
            this.joiningDate = this.joiningDate
                .fromResponseDto(userInformationResponseDto.joiningDate);
            this.roleName = userInformationResponseDto.role.name;
            this.note = userInformationResponseDto.note ?? "";
        }
    }

    public toRequestDto(): RequestDtos.User.UpsertUserInformation {
        return {
            joiningDate: this.joiningDate.toRequestDto(),
            roleName: this.roleName ?? "",
            note: this.note || null
        };
    }
}