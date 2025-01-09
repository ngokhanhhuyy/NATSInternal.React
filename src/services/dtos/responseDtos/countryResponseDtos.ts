declare global {
    namespace ResponseDtos.Country {
        type Single = Implements<IBasic, {
            id: number;
            name: string;
            code: string;
        }>;

        type Initial = Implements<IHasOptionsInitial<Single>, {
            displayName: string;
            allAsOptions: Single[];
        }>;
    }
}

export { };