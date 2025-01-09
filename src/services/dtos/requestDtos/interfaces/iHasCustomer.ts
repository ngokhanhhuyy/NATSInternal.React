declare global {
    namespace RequestDtos {
        interface IHasCustomerList extends IHasStatsList {
            customerId: number;
        }

        interface IHasCustomerUpsert extends IHasStatsUpsert {
            customerId: number | null;
        }
    }
}

export { };