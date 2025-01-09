declare global {
    namespace ResponseDtos.Order {
        type DetailPhoto = Implements<IDetailPhoto, {
            id: number;
            url: string;
        }>;
    }
}

export { };
