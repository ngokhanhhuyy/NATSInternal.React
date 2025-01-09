declare global {
    namespace ResponseDtos.Treatment {
        type Photo = Implements<IDetailPhoto, {
            id: number;
            url: string;
            type: import("@enums").TreatmentPhotoType;
        }>;
    }
}

export { };