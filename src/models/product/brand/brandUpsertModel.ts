import { AbstractClonableModel } from "@/models/baseModels";
import { CountrySingleModel } from "../country/countrySingleModel";

export class BrandUpsertModel
        extends AbstractClonableModel<BrandUpsertModel>
        implements IHasSinglePhotoUpsertModel {
    public readonly id: number = 0;
    public readonly name: string = "";
    public readonly website: string = "";
    public readonly socialMediaUrl: string = "";
    public readonly phoneNumber: string = "";
    public readonly email: string = "";
    public readonly address: string = "";
    public readonly thumbnailUrl: string | null = null;
    public readonly thumbnailFile: string | null = null;
    public readonly thumbnailChanged: boolean = false;
    public readonly country: CountrySingleModel | null = null;
    public readonly canDelete: boolean | undefined;

    constructor(responseDto?: ResponseDtos.Brand.Detail) {
        super();

        if (responseDto) {
            this.id = responseDto.id;
            this.name = responseDto.name;
            this.website = responseDto.website?.replace("https://", "") || "";
            this.socialMediaUrl = responseDto.socialMediaUrl?.replace("https://", "") || "";
            this.phoneNumber = responseDto.phoneNumber || "";
            this.email = responseDto.email || "";
            this.address = responseDto.address || "";
            this.thumbnailUrl = responseDto.thumbnailUrl;
            this.thumbnailFile = null;
            this.thumbnailChanged = false;
            this.country = responseDto.country && new CountrySingleModel(responseDto.country);
            this.canDelete = responseDto.authorization.canDelete;
        }
    }

    public toRequestDto(): RequestDtos.Brand.Upsert {
        return {
            name: this.name,
            website: this.website || null,
            socialMediaUrl: this.socialMediaUrl || null,
            phoneNumber: this.phoneNumber || null,
            email: this.email || null,
            address: this.address || null,
            thumbnailFile: this.thumbnailFile || null,
            thumbnailChanged: this.thumbnailChanged,
            countryId: this.country?.toRequestDto() || null
        };
    }
}