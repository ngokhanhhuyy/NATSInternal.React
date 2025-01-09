import { Gender } from "@enums";
import { CustomerExistingAuthorizationModel } from "./customerExistingAuthorizationModel";
import { useAvatarUtility } from "@/utilities/avatarUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const avatarUtility = useAvatarUtility();
const routeGenerator = useRouteGenerator();

export class CustomerBasicModel
        implements IUpsertableBasicModel<CustomerExistingAuthorizationModel> {
    public readonly id: number;
    public readonly fullName: string;
    public readonly nickName: string | null;
    public readonly gender: Gender = Gender.Male;
    public readonly phoneNumber: string | null;
    public readonly debtAmount: number;
    public readonly avatarUrl: string;
    public readonly authorization: CustomerExistingAuthorizationModel | null;

    constructor(responseDto: ResponseDtos.Customer.Basic) {
        this.id = responseDto.id;
        this.fullName = responseDto.fullName;
        this.nickName = responseDto.nickName;
        this.gender = responseDto.gender;
        this.phoneNumber = responseDto.phoneNumber;
        this.debtAmount = responseDto.debtAmount;
        this.authorization = responseDto.authorization &&
            new CustomerExistingAuthorizationModel(responseDto.authorization);
        this.avatarUrl = avatarUtility.getDefaultAvatarUrlByFullName(responseDto.fullName);
    }

    public get detailRoute(): string {
        return routeGenerator.getCustomerDetailRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getCustomerUpdateRoutePath(this.id);
    }
}