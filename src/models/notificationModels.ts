import { AbstractClonableModel } from "./baseModels";
import { NotificationType } from "@/services/dtos/enums";
import { UserBasicModel } from "./userModels";
import { DateTimeDisplayModel } from "./dateTimeModels";

export class NotificationModel {
    public id: number;
    public type: NotificationType;
    public dateTime: DateTimeDisplayModel;
    public resourceIds: number[];
    public createdUser: UserBasicModel | null;
    public isRead: boolean;

    constructor(responseDto: ResponseDtos.Notification.Single) {
        this.id = responseDto.id;
        this.type = responseDto.type;
        this.dateTime = new DateTimeDisplayModel(responseDto.dateTime);
        this.resourceIds = responseDto.resourceIds ?? [];
        this.createdUser = responseDto.createdUser &&
            new UserBasicModel(responseDto.createdUser);
        this.isRead = responseDto.isRead;
    }

    public get route(): string {
        const resourceIds = this.resourceIds;
        const typeName: string = NotificationType[this.type];
        const pairs: Record<string, () => string> = {
            "UserCreation": () => `/users/${resourceIds[0]}`,
            "UserModification": () => `/users/${resourceIds[0]}`,
            "UserDeletion": () => `/users/${resourceIds[0]}`,
            "UserBirthday": () => "/users",
            "UserJoiningDateAnniversary": () => "/users",
        
            "CustomerCreation": () => `/customers/${resourceIds[0]}`,
            "CustomerModification": () => `/customers/${resourceIds[0]}`,
            "CustomerDeletion": () => "/customers",
            "CustomerBirthday": () => `/customers/${resourceIds[0]}`,

            "BrandCreation": () => `/brands/${resourceIds[0]}`,
            "BrandModification": () => `/brands/${resourceIds[0]}`,
            "BrandDeletion": () => "/brands",
        
            "ProductCreation": () => `/products/${resourceIds[0]}`,
            "ProductModification": () => `/products/${resourceIds[0]}`,
            "ProductDeletion": () =>  "/products",

            "ProductCategoryCreation": () => "/products",
            "ProductCategoryModification": () => "/products",
            "ProductCategoryDeletion": () => "/products",
        
            "ExpenseCreation": () => `/expenses/${resourceIds[0]}`,
            "ExpenseModification": () => `/expenses/${resourceIds[0]}`,
            "ExpenseDeletion": () => "/expenses",
        
            "SupplyCreation": () => `/supplies/${resourceIds[0]}`,
            "SupplyModification": () => `/supplies/${resourceIds[0]}`,
            "SupplyDeletion": () => "/supplies",
        
            "ConsultantCreation": () => `/consultants/${resourceIds[0]}`,
            "ConsultantModification": () => `/consultants/${resourceIds[0]}`,
            "ConsultantDeletion": () => "/consultants",
        
            "OrderCreation": () => `/orders/${resourceIds[0]}`,
            "OrderModification": () => `/orders/${resourceIds[0]}`,
            "OrderDeletion": () => "/orders",
        
            "TreatmentCreation": () => `/treatments/${resourceIds[0]}`,
            "TreatmentModification": () => `/treatments/${resourceIds[0]}`,
            "TreatmentDeletion": () => "/treatments",
        
            "DebtIncurrenceCreation": () => `/customers/${resourceIds[0]}`,
            "DebtIncurrenceModification": () => `/customers/${resourceIds[0]}`,
            "DebtIncurrenceDeletion": () => `/customers/${resourceIds[0]}`,
        
            "DebtPaymentCreation": () => `/customers/${resourceIds[0]}`,
            "DebtPaymentModification": () => `/customers/${resourceIds[0]}`,
            "DebtPaymentDeletion": () => `/customers/${resourceIds[0]}`,

            "AnnouncementCreation": () => `/users/${resourceIds[0]}`,
            "AnnouncementModification": () => `/users/${resourceIds[0]}`,
            "AnnouncementDeletion": () => "/users"
        };

        return pairs[typeName]();
    }
}

export class NotificationListModel extends AbstractClonableModel<NotificationListModel> {
    public readonly page: number = 1;
    public readonly resultsPerPage = 10;
    public readonly pageCount: number = 0;
    public readonly items: NotificationModel[] = [];

    public fromResponseDto(responseDto: ResponseDtos.Notification.List):
            NotificationListModel {
        return this.from({
            pageCount: responseDto.pageCount,
            items: (responseDto.items ?? []).map(i => new NotificationModel(i))
        });
    }

    public add(singleResponseDto: ResponseDtos.Notification.Single): NotificationListModel {
        const notification = new NotificationModel(singleResponseDto);
        return this.from({ items: [ ...this.items, notification ] });
    }

    public toRequestDto(): RequestDtos.Notification.List {
        return {
            page: this.page,
            resultsPerPage: this.resultsPerPage
        };
    }
}