declare global {
    interface IProductGroupingBasicModel<
                TAuthorization extends IUpsertableExistingAuthorizationModel>
            extends IUpsertableBasicModel<TAuthorization> {
        readonly id: number;
        readonly name: string;
    }
}

export default global;