import { BrandExistingAuthorizationModel } from "./brandExistingAuthorizationModel";
import { usePhotoUtility } from "@/utilities/photoUtility";
import { useRouteGenerator } from "@/router/routeGenerator";

const photoUtility = usePhotoUtility();
const routeGenerator = useRouteGenerator();

export class BrandBasicModel implements
        IUpsertableBasicModel<BrandExistingAuthorizationModel>,
        IHasPhotoBasicModel {
    public readonly id: number;
    public readonly name: string;
    public readonly thumbnailUrl: string;
    public readonly authorization: BrandExistingAuthorizationModel | null;

    constructor(responseDto: ResponseDtos.Brand.Basic) {
        this.id = responseDto.id;
        this.name = responseDto.name;
        this.thumbnailUrl = responseDto.thumbnailUrl ?? photoUtility.getDefaultPhotoUrl();
        this.authorization = responseDto.authorization &&
            new BrandExistingAuthorizationModel(responseDto.authorization);
    }
    
    public get detailRoute(): string {
        return routeGenerator.getBrandUpdateRoutePath(this.id);
    }

    public get updateRoute(): string {
        return routeGenerator.getBrandUpdateRoutePath(this.id);
    }
}