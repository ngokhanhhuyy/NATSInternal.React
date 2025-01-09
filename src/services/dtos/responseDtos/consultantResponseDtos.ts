declare global {
    namespace ResponseDtos.Consultant {
        type Basic = Implements<IHasCustomerBasic<ExistingAuthorization>, {
            id: number;
            amount: number;
            statsDateTime: string;
            isLocked: boolean;
            customer: ResponseDtos.Customer.Basic;
            authorization: ExistingAuthorization | null;
        }>;
        
        type List = Implements<IHasCustomerList<Basic, ExistingAuthorization>, {
            pageCount: number;
            items: Basic[];
        }>;
        
        type Detail = Implements<IHasCustomerDetail<UpdateHistory, ExistingAuthorization>, {
            id: number;
            statsDateTime: string;
            amountBeforeVat: number;
            vatAmount: number;
            isLocked: boolean;
            customer: ResponseDtos.Customer.Basic;
            updateHistories: UpdateHistory[] | null;
            createdUser: ResponseDtos.User.Basic;
            createdDateTime: string;
            note: string;
            authorization: ExistingAuthorization;
        }>;
        
        type CreatingAuthorization = Implements<IHasStatsCreatingAuthorization, {
            canSetStatsDateTime: boolean;
        }>;
        
        type ExistingAuthorization = Implements<IHasStatsExistingAuthorization, {
            canEdit: boolean;
            canDelete: boolean;
            canSetStatsDateTime: boolean;
        }>;

        type Initial = Implements<IHasStatsInitial<CreatingAuthorization>, {
            displayName: string;
            listSortingOptions: ResponseDtos.List.SortingOptions;
            listMonthYearOptions: ResponseDtos.List.MonthYearOptions;
            creatingAuthorization: CreatingAuthorization | null;
            creatingPermission: boolean;
        }>;
    }
}

export { };
