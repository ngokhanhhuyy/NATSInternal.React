import { ExpenseCategory } from "@/services/dtos/enums";
import { ExpenseUpdateHistoryModel } from "../expenseUpdateHistoryModels";
import { ExpenseExistingAuthorizationModel } from "./expenseExistingAuthorizationModel";
import { ExpenseDetailPhotoModel } from "./expensePhoto/expenseDetailPhotoModel";
import { UserBasicModel } from "../user/userBasicModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

export class ExpenseDetailModel implements
        IHasStatsDetailModel<ExpenseUpdateHistoryModel, ExpenseExistingAuthorizationModel>,
        IHasMultiplePhotoDetailModel<ExpenseDetailPhotoModel> {
    public readonly id: number;
    public readonly amountAfterVat: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly createdDateTime: DateTimeDisplayModel;
    public readonly category: ExpenseCategory;
    public readonly note: string;
    public readonly isLocked: boolean;
    public readonly createdUser: UserBasicModel;
    public readonly payeeName: string;
    public readonly photos: ExpenseDetailPhotoModel[];
    public readonly authorization: ExpenseExistingAuthorizationModel;
    public readonly updateHistories: ExpenseUpdateHistoryModel[] | null;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Expense.Detail) {
        this.id = responseDto.id;
        this.amountAfterVat = responseDto.amountAfterVat;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.createdDateTime = new DateTimeDisplayModel(responseDto.createdDateTime);
        this.category = responseDto.category;
        this.note = responseDto.note ?? "";
        this.isLocked = responseDto.isLocked;
        this.createdUser = new UserBasicModel(responseDto.createdUser);
        this.payeeName = responseDto.payee.name;
        this.photos = responseDto.photos?.map(p => new ExpenseDetailPhotoModel(p)) ?? [];
        this.authorization = new ExpenseExistingAuthorizationModel(responseDto.authorization);
        this.updateHistories = responseDto.updateHistories &&
            responseDto.updateHistories.map(uh => new ExpenseUpdateHistoryModel(uh));
        this.detailRoute = routeGenerator.getExpenseDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getExpenseUpdateRoutePath(this.id);
    }
}