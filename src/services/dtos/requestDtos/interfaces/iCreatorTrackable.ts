declare global {
    namespace RequestDtos {
        interface ICreatorTrackableList extends ISortablePaginatedList {
            createdUserId: number;
        }
    }
}

export { };