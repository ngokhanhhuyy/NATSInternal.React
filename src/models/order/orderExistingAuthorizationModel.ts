export class OrderExistingAuthorizationModel implements IHasStatsExistingAuthorizationModel {
    public readonly canEdit: boolean = true;
    public readonly canDelete: boolean = false;
    public readonly canSetStatsDateTime: boolean;
    
    constructor(responseDto: ResponseDtos.Order.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
        this.canSetStatsDateTime = responseDto.canSetStatsDateTime;
    }
}