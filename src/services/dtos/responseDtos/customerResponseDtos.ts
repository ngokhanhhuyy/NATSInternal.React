declare global {
    namespace ResponseDtos.Customer {
        type Basic = Implements<IUpsertableBasic<ExistingAuthorization>, {
            id: number;
            fullName: string;
            nickName: string | null;
            gender: import("@enums").Gender;
            birthday: string | null;
            phoneNumber: string | null;
            debtAmount: number;
            authorization: ExistingAuthorization | null;
        }>;
        
        type List = Implements<IUpsertableList<Basic, ExistingAuthorization>, {
            pageCount: number;
            items: ResponseDtos.Customer.Basic[];
        }>;
        
        type Detail = Implements<IUpsertableDetail<ExistingAuthorization>, {
            id: number;
            firstName: string;
            middleName: string | null;
            lastName: string;
            fullName: string;
            nickName: string | null;
            gender: import("@enums").Gender;
            birthday: string | null;
            phoneNumber: string | null;
            zaloNumber: string | null;
            facebookUrl: string | null;
            email: string | null;
            address: string | null;
            note: string | null;
            createdUser: ResponseDtos.User.Basic;
            createdDateTime: string;
            updatedDateTime: string | null;
            introducer: ResponseDtos.Customer.Basic | null;
            debtAmount: number;
            debtOperations: DebtOperation[] | null;
            authorization: ExistingAuthorization;
        }>;
        
        type ExistingAuthorization = Implements<IUpsertableExistingAuthorization, {
            canEdit: boolean;
            canDelete: boolean;
        }>;
        
        type DebtOperation = {
            id: number;
            operation: import("@enums").DebtOperationType;
            amount: number;
            operatedDateTime: string;
            isLocked: boolean;
            authorization: DebtOperationAuthorization;
        }
        
        type DebtOperationAuthorization = {
            canEdit: boolean;
            canDelete: boolean;
        }

        type Initial = Implements<IUpsertableInitial & ISortableInitial, {
            displayName: string;
            listSortingOptions: ResponseDtos.List.SortingOptions;
            creatingPermission: boolean;
        }>;

        type NewStats = {
            thisMonthCount: number;
            percentageComparedToLastMonth: number;
        }
    }
}

export { };