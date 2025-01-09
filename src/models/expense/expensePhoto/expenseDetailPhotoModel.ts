export class ExpenseDetailPhotoModel implements IDetailPhotoModel  {
    public readonly id: number;
    public readonly url: string;

    constructor(responseDto: ResponseDtos.Expense.DetailPhoto) {
        this.id = responseDto.id;
        this.url = responseDto.url;
    }
}