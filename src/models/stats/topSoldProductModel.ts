import { usePhotoUtility } from "@/utilities/photoUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const photoUtility = usePhotoUtility();
const routeGenerator = useRouteGenerator();

export class TopSoldProductModel {
    public readonly id: number;
    public readonly name: string;
    public readonly unit: string;
    public readonly thumbnailUrl: string;
    public readonly amount: number;
    public readonly quantity: number;

    constructor(responseDto: ResponseDtos.Stats.TopSoldProduct) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.unit = responseDto.unit;
        this.thumbnailUrl = responseDto.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
        this.amount = responseDto.amount;
        this.quantity = responseDto.quantity;
    }

    public get detailRoute(): string {
        return routeGenerator.getProductDetailRoutePath(this.id);
    }
}