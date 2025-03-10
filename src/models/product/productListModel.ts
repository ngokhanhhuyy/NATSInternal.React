import { AbstractClonableModel } from "@models/baseModels";
import { ProductBasicModel } from "./productBasicModel";
import type { ProductExistingAuthorizationModel } from "./productExistingAuthorizationModel";
import { ProductCategoryMinimalModel } from "./productCategory/productCategoryMinimalModel";
import { BrandMinimalModel } from "./brand/brandMinimalModel";
import { ListSortingOptionsModel } from "../list/listSortingOptionsModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class ProductListModel
        extends AbstractClonableModel<ProductListModel>
        implements
            IUpsertableListModel<ProductBasicModel, ProductExistingAuthorizationModel>,
            ISortableListModel<ProductBasicModel> {
    public readonly sortingByAscending: boolean | undefined;
    public readonly sortingByField: string | undefined;
    public readonly categoryId: number | undefined;
    public readonly brandId: number | undefined;
    public readonly productName: string | undefined;
    public readonly page: number = 1;
    public readonly resultsPerPage: number = 15;
    public readonly items: ProductBasicModel[] = [];
    public readonly pageCount: number = 0;
    public readonly brandOptions: BrandMinimalModel[] | undefined;
    public readonly categoryOptions: ProductCategoryMinimalModel[] | undefined;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string = routeGenerator.getProductCreateRoutePath();

    constructor(
            productListResponseDto: ResponseDtos.Product.List,
            brandOptionResponseDtos?: ResponseDtos.Brand.Minimal[],
            categoryOptionResponseDtos?: ResponseDtos.ProductCategory.Minimal[],
            initialResponseDto?: ResponseDtos.Product.Initial,
            requestDto?: RequestDtos.Product.List) {
        super();

        this.items = productListResponseDto.items.map(dto => new ProductBasicModel(dto)) || [];
        this.pageCount = productListResponseDto.pageCount;
        this.categoryOptions = categoryOptionResponseDtos
            ?.map(dto => new ProductCategoryMinimalModel(dto)) ?? [];
        this.brandOptions = brandOptionResponseDtos
            ?.map(dto => new BrandMinimalModel(dto)) ?? [];

        if (initialResponseDto) {
            const sortingOptions = initialResponseDto.listSortingOptions;
            this.sortingByAscending = sortingOptions.defaultAscending;
            this.sortingByField = sortingOptions.defaultFieldName;
            this.sortingOptions = new ListSortingOptionsModel(sortingOptions);
            this.canCreate = initialResponseDto.creatingPermission;
        }

        if (requestDto) {
            this.categoryId = requestDto.categoryId;
            this.brandId = requestDto.brandId;
            this.productName = requestDto.productName;
            this.page = requestDto.page ?? this.page;
            this.resultsPerPage = requestDto.resultsPerPage ?? 15;
        }
    }

    public fromListResponseDto(responseDto: ResponseDtos.Product.List): ProductListModel {
        return this.from({
            items: responseDto.items?.map(dto => new ProductBasicModel(dto)) || [],
            pageCount: responseDto.pageCount
        });
    }

    public toRequestDto(): RequestDtos.Product.List {
        return {
            categoryId: this.categoryId,
            brandId: this.brandId,
            productName: this.productName ,
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}