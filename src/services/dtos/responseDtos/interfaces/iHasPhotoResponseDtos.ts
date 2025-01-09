declare global {
    namespace ResponseDtos {
        interface IHasThumbnailBasic {
            thumbnailUrl: string | null;
        }
        
        interface IHasThumbnailDetail {
            thumbnailUrl: string | null;
        }
        
        interface IHasMultiplePhotosDetail<TPhoto extends IDetailPhoto> {
            photos: TPhoto[] | null;
        }
        
        interface IDetailPhoto {
            id: number;
            url: string;
        }
    }
}

export { };