import { DateDisplayModel } from "@models/dateTime/dateDisplayModel";
import { DateTimeDisplayModel } from "@models/dateTime/dateTimeDisplayModel";
import { RoleMinimalModel } from "@models/role/roleMinimalModel";

export class UserUserInformationDetailModel {
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly updatedDateTime: DateTimeDisplayModel | null;
    public readonly joiningDate: DateDisplayModel | null;
    public readonly role: RoleMinimalModel;
    public readonly note: string | null;

    constructor(responseDto: ResponseDtos.User.UserInformation) {
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.updatedDateTime = responseDto.updatedDateTime
            ? new DateTimeDisplayModel(responseDto.updatedDateTime)
            : null;
        this.joiningDate = responseDto.joiningDate
            ? new DateDisplayModel(responseDto.joiningDate)
            : null;
        this.role = new RoleMinimalModel(responseDto.role);
        this.note = responseDto.note;
    }
}