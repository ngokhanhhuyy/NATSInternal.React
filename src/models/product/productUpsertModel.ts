import { AbstractClonableModel } from "../baseModels";
import { ClonableArrayModel } from "../arrayModel";
import { BrandMinimalModel } from "../brandModels";
import { ProductCategoryMinimalModel } from "../productCategoryModels";
import { ProductUpsertPhotoModel } from "./productPhoto/productUpsertPhotoModel";
import { usePhotoUtility } from "@/utilities/photoUtility";

const photoUtility = usePhotoUtility();

export class ProductUpsertModel
        extends AbstractClonableModel<ProductUpsertModel>
        implements
            IHasSinglePhotoUpsertModel,
            IHasMultiplePhotoUpsertModel<ProductUpsertPhotoModel> {
    public readonly id: number = 0;
    public readonly name: string = "";
    public readonly description: string = "";
    public readonly unit: string = "";
    public readonly defaultPrice: number = 0;
    public readonly defaultVatPercentage: number = 10;
    public readonly isForRetail: boolean = true;
    public readonly isDiscontinued: boolean = false;
    public readonly thumbnailUrl: string | null = null;
    public readonly thumbnailFile: string | null = null;
    public readonly thumbnailChanged: boolean = false;
    public readonly categoryId: number | null = null;
    public readonly brandId: number | null = null;
    public readonly photos: ProductUpsertPhotoModel[];
    public readonly brandOptions: BrandMinimalModel[] = [];
    public readonly categoryOptions: ProductCategoryMinimalModel[] = [];
    public readonly canDelete: boolean = false;

    constructor(
            categoryOptions: ResponseDtos.ProductCategory.Minimal[],
            brandOptions: ResponseDtos.Brand.Minimal[],
            detail?: ResponseDtos.Product.Detail) {
        super();
        this.photos = new ClonableArrayModel();
        
        this.brandOptions = brandOptions?.map(dto => new BrandMinimalModel(dto)) ?? [];
        this.categoryOptions = categoryOptions
            ?.map(dto => new ProductCategoryMinimalModel(dto)) ?? [];

        if (detail) {
            this.id = detail.id;
            this.name = detail.name;
            this.description = detail.description ?? "";
            this.unit = detail.unit;
            this.defaultPrice = detail.defaultPrice;
            this.defaultVatPercentage = detail.defaultVatPercentage;
            this.isForRetail = detail.isForRetail;
            this.isDiscontinued = detail.isDiscontinued;
            this.thumbnailUrl = detail.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
            this.categoryId = detail.category?.id ?? null;
            this.brandId = detail.brand?.id ?? null;
            this.photos = detail.photos?.map(p => new ProductUpsertPhotoModel(p)) ?? [];;
            this.canDelete = detail.authorization.canDelete;
        }
    }

    public toRequestDto(): RequestDtos.Product.Upsert {
        return {
            name: this.name,
            description: this.description || null,
            unit: this.unit,
            defaultPrice: this.defaultPrice,
            defaultVatPercentage: this.defaultVatPercentage,
            isForRetail: this.isForRetail,
            isDiscontinued: this.isDiscontinued,
            thumbnailFile: this.thumbnailFile,
            thumbnailChanged: this.thumbnailChanged,
            categoryId: this.categoryId,
            brandId: this.brandId,
            photos: this.photos.length ? this.photos.map(p => p.toRequestDto()) : null
        };
    }
}