import type { ListMonthYearOptionsModel } from "../list/listMonthYearOptionsModel";
import type { ListMonthYearModel } from "../list/listMonthYearModel";
import { UserBasicModel } from "../userModels";
import type { DateTimeDisplayModel } from "../dateTimeModels";
import type { StatsDateTimeInputModel } from "../dateTime/statsDateTimeInputModel";

declare global {
    interface IHasStatsListModel<
                TList extends object,
                TBasic extends IHasStatsBasicModel<TAuthorization>,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends
                IClonableModel<TList>,
                IUpsertableListModel<TBasic, TAuthorization>,
                ISortableListModel<TBasic> {
        readonly monthYear: ListMonthYearModel | undefined;
        readonly monthYearOptions: ListMonthYearOptionsModel | undefined;
    }
    
    interface IHasStatsBasicModel<TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IUpsertableBasicModel<TAuthorization> {
        readonly amount: number;
        readonly statsDateTime: DateTimeDisplayModel;
        readonly isLocked: boolean;
    }
    
    interface IHasStatsDetailModel<
                TUpdateHistory extends IHasStatsUpdateHistoryModel,
                TAuthorization extends IHasStatsExistingAuthorizationModel>
            extends IUpsertableDetailModel<TAuthorization> {
        readonly createdDateTime: DateTimeDisplayModel;
        readonly statsDateTime: DateTimeDisplayModel;
        readonly note: string | null;
        readonly isLocked: boolean;
        readonly createdUser: UserBasicModel;
        readonly updateHistories: TUpdateHistory[] | null;
    }
    
    interface IHasStatsUpsertModel<TUpsert extends object> extends IClonableModel<TUpsert> {
        readonly id: number;
        readonly statsDateTime: StatsDateTimeInputModel;
        readonly note: string;
        readonly updatedReason: string;
        readonly canSetStatsDateTime: boolean;
        readonly canDelete: boolean;
    }

    interface IHasStatsCreatingAuthorizationModel {
        readonly canSetStatsDateTime: boolean;
    }
    
    interface IHasStatsExistingAuthorizationModel
            extends IUpsertableExistingAuthorizationModel {
        readonly canSetStatsDateTime: boolean;
    }
    
    interface IHasStatsUpdateHistoryModel extends IUpdateHistoryModel {
        readonly oldStatsDateTime: DateTimeDisplayModel;
        readonly oldNote: string | null;
        readonly newStatsDateTime: DateTimeDisplayModel;
        readonly newNote: string | null;
    }
}

export { };