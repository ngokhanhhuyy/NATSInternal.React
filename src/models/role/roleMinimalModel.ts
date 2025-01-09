export class RoleMinimalModel {
    public readonly id: number;
    public readonly name: string;
    public readonly displayName: string;

    constructor(responseDto: ResponseDtos.Role.Minimal) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.displayName = responseDto.displayName;
    }
}