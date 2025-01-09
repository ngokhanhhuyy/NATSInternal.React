import { SupplyExistingAuthorizationModel } from "./supplyExistingAuthorizationModel";
import { UserBasicModel } from "../user/userBasicModel";
import { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";
import { usePhotoUtility } from "@/utilities/photoUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const photoUtility = usePhotoUtility();
const routeGenerator = useRouteGenerator();

export class SupplyBasicModel implements
        IHasStatsBasicModel<SupplyExistingAuthorizationModel>,
        IHasPhotoBasicModel {
    public readonly id: number;
    public readonly statsDateTime: DateTimeDisplayModel;
    public readonly amount: number;
    public readonly isLocked: boolean;
    public readonly user: UserBasicModel;
    public readonly thumbnailUrl: string;
    public readonly authorization: SupplyExistingAuthorizationModel | null;
    public readonly detailRoute: string;
    public readonly updateRoute: string;

    constructor(responseDto: ResponseDtos.Supply.Basic) {
        this.id = responseDto.id;
        this.statsDateTime = new DateTimeDisplayModel(responseDto.statsDateTime);
        this.amount = responseDto.amount;
        this.isLocked = responseDto.isLocked;
        this.user = new UserBasicModel(responseDto.createdUser);
        this.thumbnailUrl = responseDto.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
        this.authorization = responseDto.authorization &&
            new SupplyExistingAuthorizationModel(responseDto.authorization);
        this.detailRoute = routeGenerator.getSupplyDetailRoutePath(this.id);
        this.updateRoute = routeGenerator.getSupplyUpdateRoutePath(this.id);
    }
}