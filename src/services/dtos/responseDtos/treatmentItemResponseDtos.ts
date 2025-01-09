declare global {
    namespace ResponseDtos.Treatment {
        type Item = Implements<IHasProductDetailItem, {
            id: number;
            productAmountPerUnit: number;
            vatAmountPerUnit: number;
            quantity: number;
            product: ResponseDtos.Product.Basic;
        }>;
    }
}

export { };