declare global {
    interface IHasPhotoBasicModel extends IBasicModel {
        readonly thumbnailUrl: string;
    }
    
    interface IHasSinglePhotoDetailModel extends IHasPhotoBasicModel {
        readonly thumbnailUrl: string;
    }
    
    interface IHasSinglePhotoUpsertModel {
        readonly thumbnailUrl: string | null;
        readonly thumbnailFile: string | null;
        readonly thumbnailChanged: boolean;
    }
    
    interface IHasMultiplePhotoDetailModel<TDetailPhoto extends IDetailPhotoModel> {
        readonly photos: TDetailPhoto[];
    }
    
    interface IHasMultiplePhotoUpsertModel<
            TUpsertPhoto extends IUpsertPhotoModel<TUpsertPhoto>> {
        readonly photos: TUpsertPhoto[];
    }
    
    interface IDetailPhotoModel {
        readonly id: number;
        readonly url: string;
    }
    
    interface IUpsertPhotoModel<TUpsertPhoto extends object>
            extends IClonableModel<TUpsertPhoto> {
        readonly id: number | null;
        readonly url: string | null;
        readonly file: string | null;
        readonly hasBeenChanged: boolean;
        readonly hasBeenDeleted: boolean;
    }
}

export { };