import { AbstractClonableModel } from "../baseModels";
import { TreatmentBasicModel } from "../treatment/treatmentBasicModel";
import { type TreatmentExistingAuthorizationModel }
    from "../treatment/treatmentExistingAuthorizationModel";

export class CustomerDetailTreatmentListModel
        extends AbstractClonableModel<CustomerDetailTreatmentListModel>
        implements ICustomerDetailTransactionListModel<
            TreatmentBasicModel,
            TreatmentExistingAuthorizationModel> {
    readonly page: number = 1;
    readonly resultsPerPage: number = 5;
    readonly pageCount: number = 0;
    readonly items: Readonly<TreatmentBasicModel[]> = [];

    constructor(
            responseDto?: ResponseDtos.Treatment.List,
            requestDto?: RequestDtos.Treatment.List) {
        super();

        if (responseDto) {
            this.pageCount = responseDto.pageCount;
            this.items = responseDto.items.map(dto => new TreatmentBasicModel(dto));
        }

        if (requestDto) {
            this.page = requestDto.page ?? this.page;
            this.resultsPerPage = requestDto.resultsPerPage ?? this.resultsPerPage;
        }
    }

    public fromListResponseDto(responseDto: ResponseDtos.Treatment.List) {
        return this.from({
            pageCount: responseDto.pageCount,
            items: responseDto.items.map(dto => new TreatmentBasicModel(dto))
        });
    }

    public toRequestDto(): RequestDtos.Treatment.List {
        return {
            page: this.page,
            resultsPerPage: this.resultsPerPage,
        };
    }
}