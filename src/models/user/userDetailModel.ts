import { UserPersonalInformationDetailModel } from "./userPersonalInformationDetailModel";
import { UserUserInformationDetailModel } from "./userUserInformationDetailModel";
import { UserDetailAuthorizationModel } from "./userDetailAuthorizationModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class UserDetailModel {
    public readonly id: number;
    public readonly userName: string;
    public readonly personalInformation: UserPersonalInformationDetailModel | null;
    public readonly userInformation: UserUserInformationDetailModel | null;
    public readonly authorization: UserDetailAuthorizationModel;

    constructor(responseDto: ResponseDtos.User.Detail) {
        this.id = responseDto.id;
        this.userName = responseDto.userName;
        this.personalInformation = responseDto.personalInformation &&
            new UserPersonalInformationDetailModel(responseDto.personalInformation);
        this.userInformation = responseDto.userInformation &&
            new UserUserInformationDetailModel(responseDto.userInformation);
        this.authorization = new UserDetailAuthorizationModel(responseDto.authorization);
    }

    public get updateRoute(): string {
        return routeGenerator.getUserUpdateRoutePath(this.id);
    }

    public get passwordChangeRoute(): string {
        return routeGenerator.getUserPasswordChangeRoutePath();
    }

    public get passwordResetRoute(): string {
        return routeGenerator.getUserPasswordResetRoutePath(this.id);
    }
}