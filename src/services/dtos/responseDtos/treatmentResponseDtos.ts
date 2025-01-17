declare global {
    namespace ResponseDtos.Treatment {
        type Basic = Implements<IExportProductBasic<ExistingAuthorization>, {
            id: number;
            statsDateTime: string;
            amount: number;
            isLocked: boolean;
            customer: ResponseDtos.Customer.Basic;
            authorization: ExistingAuthorization | null;
        }>;
        
        type List = Implements<IExportProductList<Basic, ExistingAuthorization>, {
            pageCount: number;
            items: Basic[];
        }>;
        
        type Detail = Implements<IExportProductDetail<
                DetailItem,
                DetailPhoto,
                UpdateHistory,
                ItemUpdateHistory,
                ExistingAuthorization>, {
            id: number;
            statsDateTime: string;
            createdDateTime: string;
            serviceAmountBeforeVat: number;
            serviceVatAmount: number;
            note: string | null;
            isLocked: boolean;
            customer: ResponseDtos.Customer.Basic;
            createdUser: ResponseDtos.User.Basic;
            therapist: ResponseDtos.User.Basic | null;
            items: DetailItem[];
            photos: DetailPhoto[];
            authorization: ExistingAuthorization;
            updateHistories: UpdateHistory[] | null;
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