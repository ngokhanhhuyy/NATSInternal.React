export class ProductExistingAuthorizationModel
        implements IUpsertableExistingAuthorizationModel {
    public readonly canEdit: boolean;
    public readonly canDelete: boolean;

    constructor(responseDto: ResponseDtos.Product.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
    }
}