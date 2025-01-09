import { ProductExistingAuthorizationModel } from "./productExistingAuthorizationModel";
import { usePhotoUtility } from "@/utilities/photoUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const photoUtility = usePhotoUtility();
const routeGenerator = useRouteGenerator();

export class ProductBasicModel
        implements IUpsertableBasicModel<ProductExistingAuthorizationModel> {
    public readonly id: number;
    public readonly name: string;
    public readonly unit: string;
    public readonly defaultPrice: number;
    public readonly defaultVatPercentage: number;
    public readonly stockingQuantity: number;
    public readonly thumbnailUrl: string;
    public readonly authorization: ProductExistingAuthorizationModel | null;

    constructor(responseDto: ResponseDtos.Product.Basic) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.unit = responseDto.unit;
        this.defaultPrice = responseDto.defaultPrice;
        this.defaultVatPercentage = responseDto.defaultVatPercentage;
        this.stockingQuantity = responseDto.stockingQuantity;
        this.thumbnailUrl = responseDto.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
        this.authorization = responseDto.authorization &&
            new ProductExistingAuthorizationModel(responseDto.authorization);
    }

    public get detailRoute(): string {
        return routeGenerator.getProductDetailRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getProductUpdateRoutePath(this.id);
    }
}