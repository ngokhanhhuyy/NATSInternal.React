import { AbstractClonableModel } from "@/models/baseModels";
import { ProductCategoryBasicModel } from "./productCategoryBasicModel";
import type { ProductCategoryExistingAuthorizationModel }
    from "./productCategoryExistingAuthorizationModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class ProductCategoryListModel
        extends AbstractClonableModel<ProductCategoryListModel>
        implements
            IUpsertableListModel<
                ProductCategoryBasicModel,
                ProductCategoryExistingAuthorizationModel>,
            IPaginatedListModel<ProductCategoryBasicModel> {
    public page: number = 1;
    public resultsPerPage: number = 15;
    public pageCount: number = 0;
    public items: ProductCategoryBasicModel[] = [];
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string = routeGenerator.getProductCategoryCreateRoutePath();

    constructor(requestDto?: RequestDtos.ProductCategory.List) {
        super();
        
        if (requestDto) {
            this.page = requestDto.page ?? this.page;
            this.resultsPerPage = requestDto.resultsPerPage ?? this.resultsPerPage;
        }
    }

    public fromResponseDtos(
            responseDto: ResponseDtos.ProductCategory.List,
            canCreate?: boolean): ProductCategoryListModel {
        return this.from({ 
            pageCount: responseDto.pageCount,
            items: responseDto.items.map(dto => new ProductCategoryBasicModel(dto)),
            canCreate
        });
    }

    public toRequestDto(): RequestDtos.ProductCategory.List {
        return {
            page: this.page === 1 ? this.page : undefined,
            resultsPerPage: this.resultsPerPage === 15 ? this.resultsPerPage : undefined
        };
    }
}