// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { BrandBasicModel, BrandMinimalModel } from "./brandModels";
import {
    ProductCategoryBasicModel,
    ProductCategoryMinimalModel } from "./productCategoryModels";
import { ProductDetailPhotoModel, ProductUpsertPhotoModel } from "./productPhotoModels";
import { DateTimeDisplayModel } from "./dateTimeModels";
import { ListSortingOptionsModel } from "./listSortingModels";
import { usePhotoUtility } from "@/utilities/photoUtility";

type CategoryMinimalResponseDto = ResponseDtos.ProductCategory.Minimal;

const photoUtility = usePhotoUtility();

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
        return { name: "productDetail" };
    }

    public get updateRoute(): string {
        return { name: "productUpdate", params: { productId: this.id} };
    }
}

export class ProductListModel implements
        IUpsertableListModel<ProductBasicModel, ProductExistingAuthorizationModel>,
        ISortableListModel<ProductBasicModel> {
    public sortingByAscending: boolean | undefined;
    public sortingByField: string | undefined;
    public categoryId: number | undefined;
    public brandId: number | undefined;
    public productName: string | undefined;
    public page: number = 1;
    public resultsPerPage: number = 15;
    public items: ProductBasicModel[] = [];
    public pageCount: number = 0;
    public brandOptions: BrandMinimalModel[] | undefined;
    public categoryOptions: ProductCategoryMinimalModel[] | undefined;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string = { name: "productCreate" };

    constructor(
            listResponseDto: ResponseDtos.Product.List,
            brandOptionsResponseDto: ResponseDtos.Brand.Minimal[],
            categoryOptionsResponseDtos: ResponseDtos.ProductCategory.Minimal[],
            productInitialResponseDto?: ResponseDtos.Product.Initial,
            requestDto?: RequestDtos.Product.List) {
        this.mapFromListResponseDto(listResponseDto);
        
        if (productInitialResponseDto) {
            const sortingOptions = productInitialResponseDto.listSortingOptions;
            this.sortingOptions = new ListSortingOptionsModel(sortingOptions);
            this.sortingByField = this.sortingOptions.defaultFieldName;
            this.sortingByAscending = this.sortingOptions.defaultAscending;
            this.canCreate = productInitialResponseDto.creatingPermission;
        }

        if (brandOptionsResponseDto) {
            this.brandOptions = brandOptionsResponseDto.map(dto => new BrandMinimalModel(dto));
        }

        if (categoryOptionsResponseDtos) {
            this.categoryOptions = categoryOptionsResponseDtos
                .map(dto => new ProductCategoryMinimalModel(dto));
        }

        if (requestDto) {
            Object.assign(this, requestDto);
        }
    }

    public mapFromListResponseDto(responseDto: ResponseDtos.Product.List): void {
        this.items = responseDto.items?.map(dto => new ProductBasicModel(dto)) || [];
        this.pageCount = responseDto.pageCount;
    }

    public mapFromBrandOptionsResponseDto(responseDtos: ResponseDtos.Brand.Minimal[]) {
        this.brandOptions = responseDtos.map(dto => new BrandMinimalModel(dto));
    }

    public mapFromCategoryOptionsResponseDto(responseDtos: CategoryMinimalResponseDto[]) {
        this.categoryOptions = responseDtos.map(dto => new ProductCategoryMinimalModel(dto));
    }

    public toRequestDto(): RequestDtos.Product.List {
        return {
            categoryId: this.categoryId,
            brandId: this.brandId ,
            productName: this.productName ,
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}

export class ProductDetailModel implements
        IUpsertableDetailModel<ProductExistingAuthorizationModel>,
        IHasSinglePhotoDetailModel,
        IHasMultiplePhotoDetailModel<ProductDetailPhotoModel> {
    public id: number;
    public name: string;
    public description: string | null;
    public unit: string;
    public defaultPrice: number;
    public defaultVatPercentage: number;
    public stockingQuantity: number;
    public isForRetail: boolean;
    public isDiscontinued: boolean;
    public createdDateTime: DateTimeDisplayModel;
    public updatedDateTime: DateTimeDisplayModel | null;
    public category: ProductCategoryBasicModel | null;
    public brand: BrandBasicModel | null;
    public thumbnailUrl: string;
    public photos: ProductDetailPhotoModel[];
    public authorization: ProductExistingAuthorizationModel;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

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
        this.detailRoute = { name: "productDetail" };
        this.updateRoute = { name: "productUpdate", params: { productId: this.id} };
    }
}

export class ProductUpsertModel implements
        IHasSinglePhotoUpsertModel,
        IHasMultiplePhotoUpsertModel<ProductUpsertPhotoModel> {
    public id: number = 0;
    public name: string = "";
    public description: string = "";
    public unit: string = "";
    public defaultPrice: number = 0;
    public defaultVatPercentage: number = 0.1;
    public isForRetail: boolean = true;
    public isDiscontinued: boolean = false;
    public thumbnailUrl: string | null = null;
    public thumbnailFile: string | null = null;
    public thumbnailChanged: boolean = false;
    public categoryId: number | null = null;
    public brandId: number | null = null;
    public photos: ProductUpsertPhotoModel[] = [];
    public brandOptions: BrandMinimalModel[] = [];
    public categoryOptions: ProductCategoryMinimalModel[] = [];
    public canDelete: boolean = false;

    constructor();
    constructor(
        productDetailResponseDto: ResponseDtos.Product.Detail,
        brandOptionsResponseDtos: ResponseDtos.Brand.Minimal[],
        categoryOptionsResponseDtos: ResponseDtos.ProductCategory.Minimal[])
    constructor(
            productDetailResponseDto?: ResponseDtos.Product.Detail,
            brandOptionsResponseDtos?: ResponseDtos.Brand.Minimal[],
            categoryOptionsResponseDtos?: ResponseDtos.ProductCategory.Minimal[]) {
        if (productDetailResponseDto) {
            this.id = productDetailResponseDto.id;
            this.name = productDetailResponseDto.name;
            this.description = productDetailResponseDto.description || "";
            this.unit = productDetailResponseDto.unit;
            this.defaultPrice = productDetailResponseDto.defaultPrice;
            this.defaultVatPercentage = productDetailResponseDto.defaultVatPercentage;
            this.isForRetail = productDetailResponseDto.isForRetail;
            this.isDiscontinued = productDetailResponseDto.isDiscontinued;
            this.thumbnailUrl = productDetailResponseDto.thumbnailUrl ??
                photoUtility.getDefaultPhotoUrl();
            this.categoryId = productDetailResponseDto.category?.id ?? null;
            this.brandId = productDetailResponseDto.brand?.id ?? null;
            this.canDelete = productDetailResponseDto.authorization.canDelete;
        }

        if (brandOptionsResponseDtos) {
            this.brandOptions = brandOptionsResponseDtos
                .map(dto => new BrandMinimalModel(dto));
        }

        if (categoryOptionsResponseDtos) {
            this.categoryOptions = categoryOptionsResponseDtos
                .map(dto => new ProductCategoryMinimalModel(dto));
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

export class ProductExistingAuthorizationModel
        implements IUpsertableExistingAuthorizationModel {
    public readonly canEdit: boolean;
    public readonly canDelete: boolean;

    constructor(responseDto: ResponseDtos.Product.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
    }
}