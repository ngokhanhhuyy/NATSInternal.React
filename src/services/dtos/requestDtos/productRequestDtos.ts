declare global {
    namespace RequestDtos {
        namespace Product {
            type List = PartialOptionalImplements<IPaginatedList, {
                categoryId: number;
                brandId: number;
                productName: string;
                page: number;
                resultsPerPage: number;
            }>;
            
            type Upsert = {
                name: string;
                description: string | null;
                unit: string;
                defaultPrice: number;
                defaultVatPercentage: number;
                isForRetail: boolean;
                isDiscontinued: boolean;
                thumbnailFile: string | null;
                thumbnailChanged: boolean;
                categoryId: number | null;
                brandId: number | null;
                photos: UpsertPhoto[] | null;
            }
        }
    }
}

export { };