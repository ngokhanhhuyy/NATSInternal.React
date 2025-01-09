export class BrandMinimalModel {
    public readonly id: number;
    public readonly name: string;

    constructor(responseDto: ResponseDtos.Brand.Minimal) {
        this.id = responseDto.id;
        this.name = responseDto.name;
    }
}