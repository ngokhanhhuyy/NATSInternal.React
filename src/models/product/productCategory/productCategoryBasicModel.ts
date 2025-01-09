import { ProductCategoryExistingAuthorizationModel }
    from "./productCategoryExistingAuthorizationModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class ProductCategoryBasicModel
        implements IUpsertableBasicModel<ProductCategoryExistingAuthorizationModel> {
    public readonly id: number;
    public readonly name: string;
    public readonly authorization: ProductCategoryExistingAuthorizationModel | null;

    constructor(responseDto: ResponseDtos.ProductCategory.Basic) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.authorization = responseDto.authorization &&
            new ProductCategoryExistingAuthorizationModel(responseDto.authorization);
    }
    
    public get detailRoute(): string {
        return routeGenerator.getProductListRoutePath();
    }

    public get updateRoute(): string {
        return routeGenerator.getProductCategoryUpdateRoutePath(this.id);
    }
}