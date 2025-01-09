import { Gender } from "@enums";

declare global {
    namespace RequestDtos {
        namespace User {
            type List = PartialOptionalImplements<ISortablePaginatedList, {
                sortingByAscending: boolean;
                sortingByField: string;
                roleId: number;
                joinedRecentlyOnly: boolean;
                upcomingBirthdayOnly: boolean;
                resultsPerPage: number;
                content: string;
                page: number;
            }>;
            
            type UpsertPersonalInformation = {
                firstName: string;
                middleName: string | null;
                lastName: string;
                gender: Gender;
                birthday: string | null;
                phoneNumber: string | null;
                email: string | null;
                avatarFile : string | null;
                avatarChanged: boolean;
            }
            
            type UpsertUserInformation = {
                joiningDate: string | null;
                roleName: string | null;
                note: string | null;
            }
            
            type Create = {
                userName: string;
                password: string;
                confirmationPassword: string;
                personalInformation: UpsertPersonalInformation;
                userInformation: UpsertUserInformation;
            }
            
            type Update = {
                personalInformation: UpsertPersonalInformation;
                userInformation: UpsertUserInformation;
            }
            
            type PasswordChange = {
                currentPassword: string;
                newPassword: string;
                confirmationPassword: string;
            }
            
            type PasswordReset = {
                newPassword: string;
                confirmationPassword: string;
            }
        }
    }
}

export { };