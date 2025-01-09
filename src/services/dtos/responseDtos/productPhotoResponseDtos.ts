declare global {
    namespace ResponseDtos.Product {
        type DetailPhoto = Implements<IDetailPhoto, {
            id: number;
            url: string;
        }>;
    }
}

export { };