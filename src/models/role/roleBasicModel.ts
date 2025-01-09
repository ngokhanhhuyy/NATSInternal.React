export class RoleBasicModel {
    public readonly id: number;
    public readonly name: string;
    public readonly displayName: string;
    public readonly powerLevel: number;

    constructor(responseDto: ResponseDtos.Role.Basic) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.displayName = responseDto.displayName;
        this.powerLevel = responseDto.powerLevel;
    }
}