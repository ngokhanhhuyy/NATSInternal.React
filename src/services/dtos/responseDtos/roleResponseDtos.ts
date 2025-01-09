declare global {
    namespace ResponseDtos.Role {
        type Minimal = {
            id: number;
            name: string;
            displayName: string;
        };

        type Basic = Implements<IBasic, {
            id: number;
            name: string;
            displayName: string;
            powerLevel: number;
        }>;
    
        type Detail = {
            id: number;
            name: string;
            displayName: string;
            powerLevel: number;
            permissions: string[];
        };

        type Initial = Implements<IHasOptionsInitial<Minimal>, {
            allAsOptions: Minimal[];
        }>;
    }
}

export { };