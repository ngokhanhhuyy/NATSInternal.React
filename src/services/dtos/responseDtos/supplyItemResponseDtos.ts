declare global {
    namespace ResponseDtos.Supply {
        type DetailItem = Implements<IHasProductDetailItem, {
            id: number;
            productAmountPerUnit: number;
            quantity: number;
            product: ResponseDtos.Product.Basic;
        }>;
    }
}

export { };