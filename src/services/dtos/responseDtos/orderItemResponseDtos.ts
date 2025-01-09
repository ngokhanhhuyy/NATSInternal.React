declare global {
    namespace ResponseDtos.Order {
        type DetailItem = Implements<IExportProductDetailItem, {
            id: number;
            productAmountPerUnit: number;
            vatAmountPerUnit: number;
            quantity: number;
            product: ResponseDtos.Product.Basic;
        }>;
    }
}

export { };