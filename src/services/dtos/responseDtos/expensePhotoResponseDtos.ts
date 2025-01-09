declare global {
    namespace ResponseDtos.Expense {
        type DetailPhoto = Implements<IDetailPhoto, {
            id: number;
            url: string;
        }>;
    }
}

export { };