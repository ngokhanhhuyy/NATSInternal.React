export class ProductCategoryExistingAuthorizationModel
        implements IUpsertableExistingAuthorizationModel {
    public canEdit: boolean;
    public canDelete: boolean;

    constructor(responseDto: ResponseDtos.ProductCategory.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
    }
}