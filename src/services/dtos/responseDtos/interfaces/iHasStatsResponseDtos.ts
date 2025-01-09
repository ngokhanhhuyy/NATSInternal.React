declare global {
    namespace ResponseDtos {
        interface IHasStatsBasic<TAuthorization extends IHasStatsExistingAuthorization>
                extends IUpsertableBasic<TAuthorization> {
            amount: number;
            isLocked: boolean;
        }
        
        interface IHasStatsList<
                    TBasic extends IHasStatsBasic<TAuthorization>,
                    TAuthorization extends IHasStatsExistingAuthorization>
                extends IUpsertableList<TBasic, TAuthorization> {
        }
        
        interface IHasStatsDetail<
                    TUpdateHistory extends IHasStatsUpdateHistory,
                    TAuthorization extends IHasStatsExistingAuthorization>
                extends
                    ICreatorTrackableDetail<TAuthorization>,
                    IUpdaterTrackableDetailResponseDto<TAuthorization> {
            statsDateTime: string;
            isLocked: boolean;
            note: string | null;
            updateHistories: TUpdateHistory[] | null;
        }
    
        interface IHasStatsCreatingAuthorization {
            canSetStatsDateTime: boolean;
        }
        
        interface IHasStatsExistingAuthorization extends IUpsertableExistingAuthorization {
            canSetStatsDateTime: boolean;
        }
        
        interface IHasStatsUpdateHistory extends IUpdateHistory {
            oldStatsDateTime: string;
            newStatsDateTime: string;
            oldNote: string | null;
            newNote: string | null;
        }   

        interface IHasStatsInitial<
                    TCreatingAuthorization extends IHasStatsCreatingAuthorization>
                extends IUpsertableInitial, ISortableInitial {
            listMonthYearOptions: ResponseDtos.List.MonthYearOptions;
            creatingAuthorization: TCreatingAuthorization | null;
        }
    }
}

export { };