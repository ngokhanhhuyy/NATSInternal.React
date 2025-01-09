declare global {
    namespace RequestDtos {
        interface IDebtList extends IHasCustomerList {
        }

        interface IDebtUpsert extends IHasCustomerUpsert {
            amount: number;
        }
    }
}

export { };