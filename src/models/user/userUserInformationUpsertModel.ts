import { AbstractClonableModel } from "../baseModels";
import { RoleMinimalModel } from "@models/role/roleMinimalModel";
import { DateInputModel } from "@models/dateTime/dateInputModel";

type DetailResponseDto = ResponseDtos.User.UserInformation;

export class UserUserInformationUpsertModel
        extends AbstractClonableModel<UserUserInformationUpsertModel> {
    public readonly joiningDate: DateInputModel = new DateInputModel();
    public readonly roleName: string;
    public readonly note: string = "";
    public readonly roleOptions: RoleMinimalModel[] = [];

    constructor(roleOptions: ResponseDtos.Role.Minimal[]) {
        super();
        this.roleOptions = roleOptions.map(dto => new RoleMinimalModel(dto));
        this.roleName = roleOptions[0].name;
    }

    public fromResponseDto(detail: DetailResponseDto): UserUserInformationUpsertModel {
        return this.from({
            joiningDate: this.joiningDate.fromResponseDto(detail.joiningDate),
            roleName: detail.role.name,
            note: detail.note ?? ""
        });
    }

    public toRequestDto(): RequestDtos.User.UpsertUserInformation {
        return {
            joiningDate: this.joiningDate.toRequestDto(),
            roleName: this.roleName ?? "",
            note: this.note || null
        };
    }
}