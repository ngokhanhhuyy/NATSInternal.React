import { Gender } from "@/services/dtos/enums";
import { UserBasicAuthorizationModel } from "./userBasicAuthorizationModel";
import { RoleMinimalModel } from "../role/roleMinimalModel";
import { DateDisplayModel } from "../dateTimeModels";
import { useAvatarUtility } from "@/utilities/avatarUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const avatarUtility = useAvatarUtility();
const routeGenerator = useRouteGenerator();

export class UserBasicModel implements IUpsertableBasicModel<UserBasicAuthorizationModel> {
    public readonly id: number;
    public readonly userName: string;
    public readonly firstName: string;
    public readonly middleName: string | null;
    public readonly lastName: string;
    public readonly fullName: string;
    public readonly gender: Gender = Gender.Male;
    public readonly birthday: DateDisplayModel | null;
    public readonly joiningDate: DateDisplayModel | null;
    public readonly avatarUrl: string;
    public readonly role: RoleMinimalModel;
    public readonly authorization: UserBasicAuthorizationModel | null;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.User.Basic) {
        this.id = responseDto.id;
        this.userName = responseDto.userName;
        this.firstName = responseDto.firstName;
        this.middleName = responseDto.middleName;
        this.lastName = responseDto.lastName;
        this.fullName = responseDto.fullName;
        this.gender = responseDto.gender;
        this.birthday = responseDto.birthday
            ? new DateDisplayModel(responseDto.birthday)
            : null;
        this.joiningDate = responseDto.joiningDate
            ? new DateDisplayModel(responseDto.joiningDate)
            : null;
        this.avatarUrl = responseDto.avatarUrl ??
            avatarUtility.getDefaultAvatarUrlByFullName(responseDto.fullName);
        this.role = new RoleMinimalModel(responseDto.role);
        this.authorization = responseDto.authorization &&
            new UserBasicAuthorizationModel(responseDto.authorization);
        this.detailRoute = routeGenerator.getUserProfileRoutePath(this.id);
        this.updateRoute = routeGenerator.getUserUpdateRoutePath(this.id);
    }
}