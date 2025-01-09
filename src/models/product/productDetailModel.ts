import { BrandBasicModel } from "./brand/brandBasicModel";
import { ProductCategoryBasicModel } from "./productCategory/productCategoryBasicModel";
import { ProductDetailPhotoModel } from "./productPhoto/productDetailPhotoModel";
import { ProductExistingAuthorizationModel } from "./productExistingAuthorizationModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { usePhotoUtility } from "@/utilities/photoUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const photoUtility = usePhotoUtility();
const routeGenerator = useRouteGenerator();

export class ProductDetailModel implements
        IUpsertableDetailModel<ProductExistingAuthorizationModel>,
        IHasSinglePhotoDetailModel,
        IHasMultiplePhotoDetailModel<ProductDetailPhotoModel> {
    public readonly id: number;
    public readonly name: string;
    public readonly description: string | null;
    public readonly unit: string;
    public readonly defaultPrice: number;
    public readonly defaultVatPercentage: number;
    public readonly stockingQuantity: number;
    public readonly isForRetail: boolean;
    public readonly isDiscontinued: boolean;
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly updatedDateTime: DateTimeDisplayModel | null;
    public readonly category: ProductCategoryBasicModel | null;
    public readonly brand: BrandBasicModel | null;
    public readonly thumbnailUrl: string;
    public readonly photos: ProductDetailPhotoModel[];
    public readonly authorization: ProductExistingAuthorizationModel;

    constructor(responseDto: ResponseDtos.Product.Detail) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.description = responseDto.description;
        this.unit = responseDto.unit;
        this.defaultPrice = responseDto.defaultPrice;
        this.defaultVatPercentage = responseDto.defaultVatPercentage;
        this.stockingQuantity = responseDto.stockingQuantity;
        this.isForRetail = responseDto.isForRetail;
        this.isDiscontinued = responseDto.isDiscontinued;
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.updatedDateTime = responseDto.updatedDateTime
            ? new DateTimeDisplayModel(responseDto.updatedDateTime)
            : null;
        this.category = responseDto.category &&
            new ProductCategoryBasicModel(responseDto.category);
        this.brand = responseDto.brand && new BrandBasicModel(responseDto.brand);
        this.thumbnailUrl = responseDto.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
        this.photos = responseDto.photos?.map(dto => new ProductDetailPhotoModel(dto)) ?? [];
        this.authorization = new ProductExistingAuthorizationModel(responseDto.authorization);
    }

    public get detailRoute(): string {
        return routeGenerator.getProductDetailRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getProductUpdateRoutePath(this.id);
    }

    public with(data: Partial<MethodsOmitted<ProductDetailModel>>): ProductDetailModel {
        const newInstance: ProductDetailModel = Object.create(Object.getPrototypeOf(this));
        return Object.assign(newInstance, { ...this, ...data });
    }
}