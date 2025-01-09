// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Gender } from "@/services/dtos/enums";
import { AbstractClonableModel } from "./baseModels";
import { RoleMinimalModel } from "./roleModels";
import { DateDisplayModel, DateTimeDisplayModel, DateInputModel } from "./dateTimeModels";
import { useAvatarUtility } from "@/utilities/avatarUtility";
import { ListSortingOptionsModel } from "./listSortingModels";

const avatarUtility = useAvatarUtility();

export class UserBasicModel
        implements IUpsertableBasicModel<UserBasicAuthorizationModel> {
    public readonly id: number;
    public readonly userName: string;
    public readonly firstName: string;
    public readonly middleName: string | null;
    public readonly lastName: string;
    public readonly fullName: string;
    public readonly gender: Gender = Gender.Male;
    public readonly birthday: IDateDisplayModel | null;
    public readonly joiningDate: IDateDisplayModel | null;
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
        this.detailRoute = `/users/${this.id}`;
        this.updateRoute = `/users/${this.id}/update`;
    }
}

export class UserBasicAuthorizationModel implements IUpsertableExistingAuthorizationModel {
    public readonly canEdit: boolean;
    public readonly canChangePassword: boolean;
    public readonly canResetPassword: boolean;
    public readonly canDelete: boolean;

    constructor(responseDto: ResponseDtos.User.BasicAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canChangePassword = responseDto.canChangePassword;
        this.canResetPassword = responseDto.canResetPassword;
        this.canDelete = responseDto.canDelete;
    }
}

export class UserListModel
        extends AbstractClonableModel<UserListModel>
        implements
            IUpsertableListModel<UserBasicModel, UserBasicAuthorizationModel>,
            ISortableListModel<UserBasicModel> {
    public readonly sortingByAscending: boolean | undefined;
    public readonly sortingByField: string | undefined;
    public readonly roleId: number | undefined;
    public readonly joinedRecentlyOnly: boolean | undefined;
    public readonly upcomingBirthdayOnly: boolean | undefined;
    public readonly resultsPerPage: number = 12;
    public readonly content: string = "";
    public readonly page: number = 1;
    public readonly items: UserBasicModel[] = [];
    public readonly pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly roleOptions: RoleMinimalModel[] | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string;

    constructor(
            listResponseDto: ResponseDtos.User.List,
            initialResponseDto?: ResponseDtos.User.Initial,
            roleOptionsResponseDto?: ResponseDtos.Role.Minimal[],
            requestDto?: RequestDtos.User.List) {
        super();
        this.createRoute = "/users/create";
        this.items = listResponseDto.items?.map(dto => new UserBasicModel(dto)) || [];
        this.pageCount = listResponseDto.pageCount;
        
        if (initialResponseDto) {
            const sortingOptions = initialResponseDto.listSortingOptions;
            this.sortingOptions = new ListSortingOptionsModel(sortingOptions);
            this.sortingByField = this.sortingOptions.defaultFieldName;
            this.sortingByAscending = this.sortingOptions.defaultAscending;
            this.canCreate = initialResponseDto.creatingPermission;
        }

        if (roleOptionsResponseDto) {
            this.roleOptions = roleOptionsResponseDto.map(dto => new RoleMinimalModel(dto));
        }

        if (requestDto) {
            Object.assign(this, requestDto);
        }
    }

    public updateFromResponseDto(responseDto: ResponseDtos.User.List): UserListModel {
        return this.update({
            items: responseDto.items?.map(dto => new UserBasicModel(dto)) || [],
            pageCount: responseDto.pageCount
        });
    }

    public toRequestDto(): RequestDtos.User.List {
        return {
            sortingByAscending: this.sortingByAscending,
            sortingByField: this.sortingByField,
            page: this.page,
            resultsPerPage: this.resultsPerPage,
            content: this.content || undefined,
            roleId: this.roleId,
            joinedRecentlyOnly: this.joinedRecentlyOnly,
            upcomingBirthdayOnly: this.upcomingBirthdayOnly
        };
    }
}

export class UserPersonalInformationDetailModel {
    public readonly firstName: string;
    public readonly middleName: string | null;
    public readonly lastName: string;
    public readonly fullName: string;
    public readonly gender: Gender = Gender.Male;
    public readonly birthday: IDateDisplayModel | null;
    public readonly phoneNumber: string | null;
    public readonly email: string | null;
    public readonly avatarUrl: string | null;

    constructor(responseDto: ResponseDtos.User.PersonalInformation) {
        this.firstName = responseDto.firstName;
        this.middleName = responseDto.middleName;
        this.lastName = responseDto.lastName;
        this.fullName = responseDto.fullName;
        this.gender = responseDto.gender;
        this.birthday = responseDto.birthday
            ? new DateDisplayModel(responseDto.birthday)
            : null;
        this.phoneNumber = responseDto.phoneNumber;
        this.email = responseDto.email;
        this.avatarUrl = responseDto.avatarUrl ??
            avatarUtility.getDefaultAvatarUrlByFullName(responseDto.fullName);
    }
}

export class UserPersonalInformationUpsertModel
        extends AbstractClonableModel<UserPersonalInformationUpsertModel> {
    public readonly firstName: string = "";
    public readonly middleName: string = "";
    public readonly lastName: string = "";
    public readonly fullName: string = "";
    public readonly gender: Gender = Gender.Male;
    public readonly birthday: DateInputModel = new DateInputModel();
    public readonly phoneNumber: string = "";
    public readonly email: string = "";
    public readonly avatarUrl: string | null = null;
    public readonly avatarFile : string | null = null;
    public readonly avatarChanged: boolean = false;

    constructor(responseDto?: ResponseDtos.User.PersonalInformation) {
        super();
        if (responseDto) {
            this.firstName = responseDto.firstName;
            this.middleName = responseDto.middleName || "";
            this.lastName = responseDto.lastName;
            this.fullName = responseDto.fullName;
            this.gender = responseDto.gender;
            this.birthday = new DateInputModel(responseDto.birthday ?? undefined);
            this.phoneNumber = responseDto.phoneNumber || "";
            this.email = responseDto.email || "";
            this.avatarUrl = responseDto.avatarUrl;
        }
    }

    public toRequestDto(): RequestDtos.User.UpsertPersonalInformation {
        return {
            firstName: this.firstName,
            middleName: this.middleName || null,
            lastName: this.lastName,
            gender: this.gender,
            birthday: this.birthday.toRequestDto(),
            phoneNumber: this.phoneNumber || null,
            email: this.email || null,
            avatarFile: this.avatarFile || null,
            avatarChanged: true
        };
    }
}

export class UserUserInformationDetailModel {
    public readonly createdDateTime: IDateTimeDisplayModel;
    public readonly updatedDateTime: IDateTimeDisplayModel | null;
    public readonly joiningDate: IDateDisplayModel | null;
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

export class UserUserInformationUpsertModel
        extends AbstractClonableModel<UserUserInformationUpsertModel> {
    public readonly joiningDate: IDateInputModel;
    public readonly roleName: string | undefined;
    public readonly note: string = "";
    public readonly roleOptions: RoleMinimalModel[];

    constructor(roleOptionsResponseDtos: ResponseDtos.Role.Minimal[]);
    constructor(
        roleOptionsResponseDtos: ResponseDtos.Role.Minimal[],
        detailResponseDto: ResponseDtos.User.UserInformation);
    constructor(
            roleOptionsResponseDtos: ResponseDtos.Role.Minimal[],
            arg?: ResponseDtos.User.UserInformation) {
        super();
        if (!arg) {
            this.roleOptions = roleOptionsResponseDtos.map(dto => new RoleMinimalModel(dto));
            this.roleName = this.roleOptions[0].name;
            this.joiningDate = new DateInputModel();
        } else {
            this.joiningDate = new DateInputModel(arg.joiningDate ?? undefined);
            this.roleName = arg.role.name;
            this.note = arg.note || "";
        }
        this.roleOptions = roleOptionsResponseDtos.map(dto => new RoleMinimalModel(dto));
    }

    public toRequestDto(): RequestDtos.User.UpsertUserInformation {
        return {
            joiningDate: this.joiningDate.toRequestDto(),
            roleName: this.roleName ?? "",
            note: this.note || null
        };
    }
}

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
        return `users/${this.id}/update`;
    }

    public get passwordChangeRoute(): string {
        return "users/changPassword";
    }

    public get passwordResetRoute(): string {
        return `users/${this.id}/resetPassword`;
    }
}

export class UserDetailAuthorizationModel {
    public readonly canGetNote: boolean;
    public readonly canEdit: boolean;
    public readonly canEditUserPersonalInformation: boolean;
    public readonly canEditUserUserInformation: boolean;
    public readonly canAssignRole: boolean;
    public readonly canChangePassword: boolean;
    public readonly canResetPassword: boolean;
    public readonly canDelete: boolean;

    constructor(responseDto: ResponseDtos.User.DetailAuthorization) {
        this.canGetNote = responseDto.canGetNote;
        this.canEdit = responseDto.canEdit;
        this.canEditUserPersonalInformation = responseDto.canEditUserPersonalInformation;
        this.canEditUserUserInformation = responseDto.canEditUserUserInformation;
        this.canAssignRole = responseDto.canAssignRole;
        this.canChangePassword = responseDto.canChangePassword;
        this.canResetPassword = responseDto.canResetPassword;
        this.canDelete = responseDto.canDelete;
    }
}

export class UserCreateModel extends AbstractClonableModel<UserCreateModel> {
    public readonly id: number = 0;
    public readonly userName: string = "";
    public readonly password: string = "";
    public readonly confirmationPassword: string = "";
    public readonly personalInformation: UserPersonalInformationUpsertModel;
    public readonly userInformation: UserUserInformationUpsertModel;

    constructor(roleOptionsResponseDto: ResponseDtos.Role.Minimal[]) {
        super();
        this.personalInformation = new UserPersonalInformationUpsertModel();
        this.userInformation = new UserUserInformationUpsertModel(roleOptionsResponseDto);
    }

    public toRequestDto(): RequestDtos.User.Create {
        return {
            userName: this.userName,
            password: this.password,
            confirmationPassword: this.confirmationPassword,
            personalInformation: this.personalInformation.toRequestDto(),
            userInformation: this.userInformation.toRequestDto()
        };
    }
}

export class UserUpdateModel extends AbstractClonableModel<UserUpdateModel> {
    public readonly id: number = 0;
    public readonly personalInformation: UserPersonalInformationUpsertModel;
    public readonly userInformation: UserUserInformationUpsertModel;
    public readonly authorization: UserDetailAuthorizationModel;

    constructor(
            detailResponseDto: ResponseDtos.User.Detail,
            roleOptionsResponseDtos: ResponseDtos.Role.Minimal[]) {
        super();
        this.id = detailResponseDto.id;
        this.personalInformation =
            new UserPersonalInformationUpsertModel(detailResponseDto.personalInformation);
        this.userInformation = new UserUserInformationUpsertModel(
            roleOptionsResponseDtos,
            detailResponseDto.userInformation);
        this.authorization = new UserDetailAuthorizationModel(detailResponseDto.authorization);
    }

    public toRequestDto(): RequestDtos.User.Update {
        return {
            personalInformation: this.personalInformation.toRequestDto(),
            userInformation: this.userInformation.toRequestDto()
        };
    }
}

export class UserPasswordChangeModel extends AbstractClonableModel<UserPasswordChangeModel> {
    public readonly currentPassword: string = "";
    public readonly newPassword: string = "";
    public readonly confirmationPassword: string = "";

    public toRequestDto(): RequestDtos.User.PasswordChange {
        return {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
            confirmationPassword: this.confirmationPassword
        };
    }
}

export class UserPasswordResetModel extends AbstractClonableModel<UserPasswordResetModel> {
    public readonly id: number;
    public readonly newPassword: string = "";
    public readonly confirmationPassword: string = "";

    constructor(id: number) {
        super();
        this.id = id;
    }

    public toRequestDto(): RequestDtos.User.PasswordReset {
        return {
            newPassword: this.newPassword,
            confirmationPassword: this.confirmationPassword
        };
    }
}