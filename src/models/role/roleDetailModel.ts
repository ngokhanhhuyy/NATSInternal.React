export class RoleDetailModel {
    public readonly id: number;
    public readonly name: string;
    public readonly displayName: string;
    public readonly powerLevel: number;
    public readonly permissions: string[];

    constructor(responseDto: ResponseDtos.Role.Detail) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.displayName = responseDto.displayName;
        this.powerLevel = responseDto.powerLevel;
        this.permissions = responseDto.permissions;
    }
}