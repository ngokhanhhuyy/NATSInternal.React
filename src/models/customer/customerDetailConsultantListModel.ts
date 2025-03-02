import { AbstractClonableModel } from "../baseModels";
import { ConsultantBasicModel } from "../consultant/consultantBasicModel";
import { type ConsultantExistingAuthorizationModel }
    from "../consultant/consultantExistingAuthorizationModel";

export class CustomerDetailConsultantListModel
        extends AbstractClonableModel<CustomerDetailConsultantListModel>
        implements ICustomerDetailTransactionListModel<
            ConsultantBasicModel,
            ConsultantExistingAuthorizationModel> {
    readonly page: number = 1;
    readonly resultsPerPage: number = 5;
    readonly pageCount: number = 0;
    readonly items: Readonly<ConsultantBasicModel[]> = [];

    constructor(
            responseDto?: ResponseDtos.Consultant.List,
            requestDto?: RequestDtos.Consultant.List) {
        super();

        if (responseDto) {
            this.pageCount = responseDto.pageCount;
            this.items = responseDto.items.map(dto => new ConsultantBasicModel(dto));
        }

        if (requestDto) {
            this.page = requestDto.page ?? this.page;
            this.resultsPerPage = requestDto.resultsPerPage ?? this.resultsPerPage;
        }
    }

    public fromListResponseDto(responseDto: ResponseDtos.Consultant.List) {
        return this.from({
            pageCount: responseDto.pageCount,
            items: responseDto.items.map(dto => new ConsultantBasicModel(dto))
        });
    }

    public toRequestDto(): RequestDtos.Treatment.List {
        return {
            page: this.page,
            resultsPerPage: this.resultsPerPage,
        };
    }
}