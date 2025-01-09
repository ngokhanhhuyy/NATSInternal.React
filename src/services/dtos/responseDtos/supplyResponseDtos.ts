declare global {
    namespace ResponseDtos.Supply {
        type Basic = Implements<
                IHasStatsBasic<ExistingAuthorization> &
                IHasThumbnailBasic, {
            id: number;
            statsDateTime: string;
            amount: number;
            isLocked: boolean;
            createdUser: ResponseDtos.User.Basic;
            thumbnailUrl: string | null;
            authorization: ExistingAuthorization | null;
        }>;
        
        type List = Implements<IHasStatsList<Basic, ExistingAuthorization>, {
            pageCount: number;
            items: Basic[];
        }>;
        
        type Detail = Implements<IHasProductDetail<
                DetailItem,
                DetailPhoto,
                UpdateHistory,
                ItemUpdateHistory,
                ExistingAuthorization>, {
            id: number;
            statsDateTime: string;
            shipmentFee: number;
            note: string | null;
            createdDateTime: string;
            createdUser: ResponseDtos.User.Basic;
            isLocked: boolean;
            items: DetailItem[];
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