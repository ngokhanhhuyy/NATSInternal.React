declare global {
    namespace ResponseDtos.Order {
        type Basic = Implements<
                IExportProductBasic<ExistingAuthorization> &
                IHasThumbnailBasic, {
            amount: number;
            id: number;
            statsDateTime: string;
            isLocked: boolean;
            customer: ResponseDtos.Customer.Basic;
            thumbnailUrl: string | null;
            authorization: ExistingAuthorization | null;
        }>;
            
        type List = Implements<IExportProductList<Basic, ExistingAuthorization>, {
            pageCount: number;
            items: Basic[];
        }>;
            
        type Detail = Implements<
                IExportProductDetail<
                    DetailItem,
                    DetailPhoto,
                    UpdateHistory,
                    ItemUpdateHistory,
                    ExistingAuthorization> &
                IHasMultiplePhotosDetail<DetailPhoto>, {
            id: number;
            statsDateTime: string;
            createdDateTime: string;
            amountBeforeVat: number;
            vatAmount: number;
            note: string;
            isLocked: boolean;
            items: DetailItem[];
            customer: ResponseDtos.Customer.Basic;
            createdUser: ResponseDtos.User.Basic;
            photos: DetailPhoto[] | null;
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