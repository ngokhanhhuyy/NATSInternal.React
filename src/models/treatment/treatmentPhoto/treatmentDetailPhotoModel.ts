export class TreatmentDetailPhotoModel implements IDetailPhotoModel {
    public readonly id: number;
    public readonly url: string;

    constructor(responseDto: ResponseDtos.Treatment.DetailPhoto) {
        this.id = responseDto.id;
        this.url = responseDto.url;
    }
}