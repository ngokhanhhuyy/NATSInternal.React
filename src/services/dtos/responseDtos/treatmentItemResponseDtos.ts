declare global {
    namespace ResponseDtos.Treatment {
        type DetailItem = Implements<IHasProductDetailItem, {
            id: number;
            productAmountPerUnit: number;
            vatAmountPerUnit: number;
            quantity: number;
            product: ResponseDtos.Product.Basic;
        }>;
    }
}

export { };