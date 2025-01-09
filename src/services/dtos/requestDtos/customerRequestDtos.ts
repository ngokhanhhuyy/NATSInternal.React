import { Gender } from "@enums";
declare global {
    namespace RequestDtos {
        namespace Customer {
            type List = PartialOptionalImplements<ICreatorTrackableList, {
                sortingByField: string;
                sortingByAscending: boolean;
                searchByContent: string;
                createdUserId: number;
                page: number;
                resultsPerPage: number;
                hasRemainingDebtAmountOnly: boolean;
            }>;
            
            type Upsert = {
                firstName: string | null;
                middleName: string | null;
                lastName: string | null;
                nickName: string | null;
                gender: Gender;
                birthday: string | null;
                phoneNumber: string | null;
                zaloNumber: string | null;
                facebookUrl: string | null;
                email: string | null;
                address: string | null;
                note: string | null;
                introducerId: number | null;
            };
        }
    }
}

export { };