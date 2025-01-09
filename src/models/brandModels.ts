// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { CountryModel } from "./countryModels";
import { usePhotoUtility } from "@/utilities/photoUtility";

const photoUtility = usePhotoUtility();

export class BrandMinimalModel {
    public readonly id: number;
    public readonly name: string;

    constructor(responseDto: ResponseDtos.Brand.Minimal) {
        this.id = responseDto.id;
        this.name = responseDto.name;
    }
}

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
    
    public get detailRoute(): RouteLocationRaw {
        return { name: "productList" };
    }

    public get updateRoute(): RouteLocationRaw {
        return { name: "brandUpdate", params: { brandId: this.id } };
    }
}

export class BrandListModel implements
        IUpsertableListModel<BrandBasicModel, BrandExistingAuthorizationModel>,
        IPaginatedListModel<BrandBasicModel> {
    public page: number = 1;
    public resultsPerPage: number = 15;
    public pageCount: number = 0;
    public items: BrandBasicModel[] = [];
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: RouteLocationRaw = { name: "brandCreate" };

    constructor(
            responseDto: ResponseDtos.Brand.List,
            canCreate: boolean,
            requestDto?: RequestDtos.Brand.List) {
        this.mapFromResponseDto(responseDto);
        this.canCreate = canCreate;
        
        if (requestDto) {
            Object.assign(this, requestDto);
        }
    }

    public mapFromResponseDto(responseDto: ResponseDtos.Brand.List) {
        this.pageCount = responseDto.pageCount;
        this.items = responseDto.items.map(dto => new BrandBasicModel(dto));
    }

    public toRequestDto(): RequestDtos.Brand.List {
        return {
            page: this.page !== 1 ? this.page : undefined,
            resultsPerPage: this.resultsPerPage 
        };
    }
}

export class BrandExistingAuthorizationModel implements IUpsertableExistingAuthorizationModel {
    public readonly canEdit: boolean;
    public readonly canDelete: boolean;

    constructor(responseDto: ResponseDtos.Brand.ExistingAuthorization) {
        this.canEdit = responseDto.canEdit;
        this.canDelete = responseDto.canDelete;
    }
}

export class BrandUpsertModel implements IHasSinglePhotoUpsertModel {
    public id: number = 0;
    public name: string = "";
    public website: string = "";
    public socialMediaUrl: string = "";
    public phoneNumber: string = "";
    public email: string = "";
    public address: string = "";
    public thumbnailUrl: string | null = null;
    public thumbnailFile: string | null = null;
    public thumbnailChanged: boolean = false;
    public country: CountryModel | null = null;

    constructor(responseDto?: ResponseDtos.Brand.Detail) {
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
            this.country = responseDto.country && new CountryModel(responseDto.country);
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