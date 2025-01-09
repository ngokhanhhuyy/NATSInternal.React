import { AbstractClonableModel } from "@/models/baseModels";
import { BrandBasicModel } from "./brandBasicModel";
import type { BrandExistingAuthorizationModel } from "./brandExistingAuthorizationModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class BrandListModel
        extends AbstractClonableModel<BrandListModel>
        implements
            IUpsertableListModel<BrandBasicModel, BrandExistingAuthorizationModel>,
            IPaginatedListModel<BrandBasicModel> {
    public page: number = 1;
    public resultsPerPage: number = 15;
    public pageCount: number = 0;
    public items: BrandBasicModel[] = [];
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string = routeGenerator.getBrandCreateRoutePath();

    constructor(requestDto?: RequestDtos.Brand.List) {
        super();
        
        if (requestDto) {
            this.page = requestDto.page ?? this.page;
            this.resultsPerPage = requestDto.resultsPerPage ?? this.resultsPerPage;
        }
    }
    
    public fromResponseDtos(
            responseDto: ResponseDtos.Brand.List,
            canCreate?: boolean): BrandListModel {
        return this.from({
            pageCount: responseDto.pageCount,
            items: responseDto.items.map(dto => new BrandBasicModel(dto)),
            canCreate
        });
    }

    public toRequestDto(): RequestDtos.Brand.List {
        return {
            page: this.page !== 1 ? this.page : undefined,
            resultsPerPage: this.resultsPerPage 
        };
    }
}