export class CountryModel {
    public id: number;
    public name: string;
    public code: string;

    constructor(responseDto: ResponseDtos.Country) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.code = responseDto.code;
    }

    public toRequestDto(): number {
        return this.id;
    }
}