declare global {
    namespace ResponseDtos.Treatment {
        type DetailPhoto = Implements<IDetailPhoto, {
            id: number;
            url: string;
            type: import("@enums").TreatmentPhotoType;
        }>;
    }
}

export { };