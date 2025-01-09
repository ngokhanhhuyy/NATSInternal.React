declare global {
    namespace RequestDtos {
        namespace Product {
            type UpsertPhoto = Implements<IUpsertPhoto, {
                id: number | null;
                file: string | null;
                hasBeenChanged: boolean;
                hasBeenDeleted: boolean;
            }>;
        }
    }
}

export { };