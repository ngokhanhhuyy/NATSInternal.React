declare global {
    namespace RequestDtos {
        interface IUpsertPhoto {
            id: number | null;
            file: string | null;
            hasBeenChanged: boolean;
            hasBeenDeleted: boolean;
        }
    
        interface IHasMultiplePhotosUpsert<TPhoto extends IUpsertPhoto> {
            photos: TPhoto[] | null;
        }
    
        interface IHasThumbnailUpsert {
            thumbnailFile: string | null;
            thumbnailChanged: boolean;
        }
    }
}

export { };