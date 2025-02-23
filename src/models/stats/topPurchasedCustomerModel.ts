import { Gender } from "@/services/dtos/enums";
import { useAvatarUtility } from "@/utilities/avatarUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const avatarUtility = useAvatarUtility();
const routeGenerator = useRouteGenerator();

export class TopPurchasedCustomerModel {
    public readonly id: number;
    public readonly fullName: string;
    public readonly nickName: string;
    public readonly gender: Gender;
    public readonly avatarUrl: string;
    public readonly purchasedAmount: number;
    public readonly purchasedTransactionCount: number;

    constructor(responseDto: ResponseDtos.Stats.TopPurchasedCustomer) {
        this.id = responseDto.id;
        this.fullName = responseDto.fullName;
        this.nickName = responseDto.nickName;
        this.gender = responseDto.gender;
        this.avatarUrl = avatarUtility.getDefaultAvatarUrlByFullName(this.fullName);
        this.purchasedAmount = responseDto.purchasedAmount;
        this.purchasedTransactionCount = responseDto.purchasedTransactionCount;
    }

    public get detailRoute(): string {
        return routeGenerator.getCustomerDetailRoutePath(this.id);
    }
}