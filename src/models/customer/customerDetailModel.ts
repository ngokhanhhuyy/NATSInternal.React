import { Gender } from "@/services/dtos/enums";
import { AbstractClonableModel } from "../baseModels";
import { CustomerBasicModel } from "./customerBasicModel";
import { CustomerExistingAuthorizationModel } from "./customerExistingAuthorizationModel";
import { CustomerDebtOperationModel } from "./customerDebtOperationModel";
import { CustomerDetailConsultantListModel } from "./customerDetailConsultantListModel";
import { CustomerDetailOrderListModel } from "./customerDetailOrderListModel";
import { CustomerDetailTreatmentListModel } from "./customerDetailTreatmentListModel";
import { DateDisplayModel } from "../dateTime/dateDisplayModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { UserBasicModel } from "../user/userBasicModel";
import { useAvatarUtility } from "@/utilities/avatarUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const avatarUtility = useAvatarUtility();
const routeGenerator = useRouteGenerator();

export class CustomerDetailModel
        extends AbstractClonableModel<CustomerDetailModel>
        implements ICreatorTrackableDetailModel<CustomerExistingAuthorizationModel> {
    public readonly id: number;
    public readonly firstName: string;
    public readonly middleName: string | null;
    public readonly lastName: string;
    public readonly fullName: string;
    public readonly nickName: string | null;
    public readonly gender: Gender;
    public readonly birthday: DateDisplayModel | null;
    public readonly phoneNumber: string | null;
    public readonly zaloNumber: string | null;
    public readonly facebookUrl: string | null;
    public readonly email: string | null;
    public readonly address: string | null;
    public readonly note: string | null;
    public readonly createdUser: UserBasicModel;
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly updatedDateTime: DateTimeDisplayModel | null;
    public readonly introducer: CustomerBasicModel | null;
    public readonly debtAmount: number;
    public readonly debtOperations: CustomerDebtOperationModel[];
    public readonly avatarUrl: string;
    public readonly authorization: CustomerExistingAuthorizationModel;
    public readonly consultantList: CustomerDetailConsultantListModel;
    public readonly orderList: CustomerDetailOrderListModel;
    public readonly treatmentList: CustomerDetailTreatmentListModel;

    constructor(
            detailResponseDto: ResponseDtos.Customer.Detail,
            consultantListResponseDto: ResponseDtos.Consultant.List,
            orderListResponseDto: ResponseDtos.Order.List,
            treatmnentListResponseDto: ResponseDtos.Treatment.List) {
        super();

        this.id = detailResponseDto.id;
        this.firstName = detailResponseDto.firstName;
        this.middleName = detailResponseDto.middleName;
        this.lastName = detailResponseDto.lastName;
        this.fullName = detailResponseDto.fullName;
        this.nickName = detailResponseDto.nickName;
        this.gender = detailResponseDto.gender;
        this.birthday = detailResponseDto.birthday
            ? new DateDisplayModel(detailResponseDto.birthday)
            : null;
        this.phoneNumber = detailResponseDto.phoneNumber;
        this.zaloNumber = detailResponseDto.zaloNumber;
        this.facebookUrl = detailResponseDto.facebookUrl;
        this.email = detailResponseDto.email;
        this.address = detailResponseDto.address;
        this.note = detailResponseDto.note;
        this.createdUser = new UserBasicModel(detailResponseDto.createdUser);
        this.createdDateTime = new DateTimeDisplayModel(detailResponseDto.createdDateTime);
        this.updatedDateTime = detailResponseDto.updatedDateTime
            ? new DateTimeDisplayModel(detailResponseDto.updatedDateTime)
            : null;
        this.introducer = detailResponseDto.introducer &&
            new CustomerBasicModel(detailResponseDto.introducer);
        this.debtAmount = detailResponseDto.debtAmount;
        this.debtOperations = (detailResponseDto.debtOperations ?? [])
            .map(dh => new CustomerDebtOperationModel(dh));
        this.authorization =
            new CustomerExistingAuthorizationModel(detailResponseDto.authorization);
        this.avatarUrl = avatarUtility
            .getDefaultAvatarUrlByFullName(detailResponseDto.fullName);
        this.consultantList = new CustomerDetailConsultantListModel(consultantListResponseDto);
        this.orderList = new CustomerDetailOrderListModel(orderListResponseDto);
        this.treatmentList = new CustomerDetailTreatmentListModel(treatmnentListResponseDto);
    }

    public get detailRoute(): string {
        return routeGenerator.getCustomerDetailRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getCustomerUpdateRoutePath(this.id);
    }

    public fromConsultantList(consultantList: CustomerDetailConsultantListModel) {
        return this.from({ consultantList });
    }

    public fromOrderList(orderList: CustomerDetailOrderListModel) {
        return this.from({ orderList });
    }

    public fromTreatmentList(treatmentList: CustomerDetailTreatmentListModel) {
        return this.from({ treatmentList });
    }

    public toConsultantListRequestDto(): RequestDtos.Consultant.List {
        return {
            ...this.consultantList.toRequestDto(),
            customerId: this.id
        };
    }

    public toOrderListRequestDto(): RequestDtos.Order.List {
        return {
            ...this.orderList.toRequestDto(),
            customerId: this.id
        };
    }

    public toTreatmentListRequestDto(): RequestDtos.Treatment.List {
        return {
            ...this.treatmentList.toRequestDto(),
            customerId: this.id
        };
    }
}