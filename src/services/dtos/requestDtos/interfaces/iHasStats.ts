declare global {
    namespace RequestDtos {
        interface IHasStatsList extends ICreatorTrackableList {
            monthYear: RequestDtos.List.MonthYear;
        }

        interface IHasStatsUpsert {
            statsDateTime: string | null;
            note: string | null;
            updatedReason: string | null;
        }
    }
}

export { };