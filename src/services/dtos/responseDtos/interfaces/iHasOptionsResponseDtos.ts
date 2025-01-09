declare global {
    namespace ResponseDtos {
        interface IHasOptionsInitial<TMinimal extends IMinimal> {
            allAsOptions: TMinimal[];
        }
    }
}

export { };