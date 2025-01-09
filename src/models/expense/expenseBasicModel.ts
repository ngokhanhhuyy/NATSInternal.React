import { ExpenseCategory } from "@/services/dtos/enums";
import { ExpenseExistingAuthorizationModel } from "./expenseExistingAuthorizationModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { usePhotoUtility } from "@/utilities/photoUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const photoUtility = usePhotoUtility();
const routeGenerator = useRouteGenerator();

export class ExpenseBasicModel implements
        IHasStatsBasicModel<ExpenseExistingAuthorizationModel>,
        IHasPhotoBasicModel {
    public readonly id: number;
    public readonly amount: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly category: ExpenseCategory;
    public readonly isLocked: boolean;
    public readonly thumbnailUrl: string;
    public readonly authorization: ExpenseExistingAuthorizationModel | null;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Expense.Basic) {
        this.id = responseDto.id;
        this.amount = responseDto.amount;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.category = responseDto.category;
        this.isLocked = responseDto.isLocked;
        this.thumbnailUrl = responseDto.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
        this.authorization = responseDto.authorization &&
            new ExpenseExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = routeGenerator.getExpenseDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getExpenseUpdateRoutePath(this.id);
    }
}