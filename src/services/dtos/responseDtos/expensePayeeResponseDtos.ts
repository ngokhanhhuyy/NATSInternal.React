declare global {
    namespace ResponseDtos.Expense {
        type Payee = Implements<IBasic, {
            id: number;
            name: string;
        }>;
    }
}

export { };