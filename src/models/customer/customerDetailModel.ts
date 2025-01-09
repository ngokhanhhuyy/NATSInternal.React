import { Gender } from "@/services/dtos/enums";
import { CustomerBasicModel } from "./customerBasicModel";
import { CustomerExistingAuthorizationModel } from "./customerExistingAuthorizationModel";
import { CustomerDebtOperationModel } from "./customerDebtOperationModel";
import { DateDisplayModel } from "../dateTime/dateDisplayModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { UserBasicModel } from "../user/userBasicModel";
import { useAvatarUtility } from "@/utilities/avatarUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const avatarUtility = useAvatarUtility();
const routeGenerator = useRouteGenerator();

export class CustomerDetailModel
        implements ICreatorTrackableDetailModel<CustomerExistingAuthorizationModel> {
    public id: number;
    public firstName: string;
    public middleName: string | null;
    public lastName: string;
    public fullName: string;
    public nickName: string | null;
    public gender: Gender;
    public birthday: DateDisplayModel | null;
    public phoneNumber: string | null;
    public zaloNumber: string | null;
    public facebookUrl: string | null;
    public email: string | null;
    public address: string | null;
    public note: string | null;
    public createdUser: UserBasicModel;
    public createdDateTime: DateTimeDisplayModel;
    public updatedDateTime: DateTimeDisplayModel | null;
    public introducer: CustomerBasicModel | null;
    public debtAmount: number;
    public debtOperations: CustomerDebtOperationModel[];
    public avatarUrl: string;
    public authorization: CustomerExistingAuthorizationModel;

    constructor(responseDto: ResponseDtos.Customer.Detail) {
        this.id = responseDto.id;
        this.firstName = responseDto.firstName;
        this.middleName = responseDto.middleName;
        this.lastName = responseDto.lastName;
        this.fullName = responseDto.fullName;
        this.nickName = responseDto.nickName;
        this.gender = responseDto.gender;
        this.birthday = responseDto.birthday
            ? new DateDisplayModel(responseDto.birthday)
            : null;
        this.phoneNumber = responseDto.phoneNumber;
        this.zaloNumber = responseDto.zaloNumber;
        this.facebookUrl = responseDto.facebookUrl;
        this.email = responseDto.email;
        this.address = responseDto.address;
        this.note = responseDto.note;
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.updatedDateTime = responseDto.updatedDateTime
            ? new DateTimeDisplayModel(responseDto.updatedDateTime)
            : null;
        this.introducer = responseDto.introducer &&
            new CustomerBasicModel(responseDto.introducer);
        this.debtAmount = responseDto.debtAmount;
        this.debtOperations = (responseDto.debtOperations ?? [])
            .map(dh => new CustomerDebtOperationModel(dh));
        this.authorization = new CustomerExistingAuthorizationModel(responseDto.authorization);
        this.avatarUrl = avatarUtility.getDefaultAvatarUrlByFullName(responseDto.fullName);
    }

    public get detailRoute(): string {
        return routeGenerator.getCustomerDetailRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getCustomerUpdateRoutePath(this.id);
    }
}