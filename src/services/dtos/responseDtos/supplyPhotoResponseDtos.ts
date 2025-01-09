declare global {
    namespace ResponseDtos.Supply {
        type DetailPhoto = Implements<IDetailPhoto, {
            id: number;
            url: string;
        }>;
    }
}

export { };