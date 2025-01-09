export class ProductCategoryMinimalModel {
    public readonly id: number;
    public readonly name: string;

    constructor(responseDto: ResponseDtos.ProductCategory.Minimal) {
        this.id = responseDto.id;
        this.name = responseDto.name;
    }
}

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
        return { name: "productList" };
    }

    public get updateRoute(): string {
        return { name: "productCategoryUpdate", params: { productCategoryId: this.id } };
    }
}

export class ProductCategoryListModel
        implements
            IUpsertableListModel<ProductCategoryBasicModel, ProductCategoryExistingAuthorizationModel>,
            IPaginatedListModel<ProductCategoryBasicModel> {
    public page: number = 1;
    public resultsPerPage: number = 15;
    public pageCount: number = 0;
    public items: ProductCategoryBasicModel[] = [];
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: RouteLocationRaw = { name: "productCategoryCreate" };

    constructor(
            responseDto: ResponseDtos.ProductCategory.List,
            canCreate?: boolean,
            requestDto?: RequestDtos.ProductCategory.List) {
        this.mapFromResponseDto(responseDto);
        this.canCreate = canCreate;

        if (requestDto) {
            Object.assign(this, requestDto);
        }
    }

    public mapFromResponseDto(responseDto: ResponseDtos.ProductCategory.List) {
        this.pageCount = responseDto.pageCount;
        this.items = responseDto.items.map(dto => new ProductCategoryBasicModel(dto));
    }

    public toRequestDto(): RequestDtos.ProductCategory.List {
        return {
            page: this.page === 1 ? this.page : undefined,
            resultsPerPage: this.resultsPerPage === 15 ? this.resultsPerPage : undefined
        };
    }
}

export class ProductCategoryUpsertModel {
    public id: number = 0;
    public name: string = "";

    constructor(responseDto?: ResponseDtos.ProductCategory.Detail) {
        if (responseDto) {
            this.id = responseDto.id;
            this.name = responseDto.name;
        }
    }

    public toRequestDto(): RequestDtos.ProductCategory.Upsert {
        return { name: this.name };
    }
}

export class ProductCategoryExistingAuthorizationModel
        implements IUpsertableExistingAuthorizationModel {
    public canEdit: boolean;
    public canDelete: boolean;

    constructor(responseDto: ResponseDtos.ProductCategory.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
    }
}