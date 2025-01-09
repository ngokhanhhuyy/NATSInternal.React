export enum Gender {
    Male = 0,
    Female = 1
}

export enum ExpenseCategory {
    Utilities,
    Equipment,
    Office,
    Staff
}

export enum DebtOperationType {
    DebtIncurrence,
    DebtPayment
}

export enum TreatmentPhotoType {
    Before,
    After
}

export enum AnnouncementCategory {
    Announcement,
    News,
    Warning
}

export enum NotificationType {
    // Enum values for user interactions.
    UserCreation,
    UserModification,
    UserDeletion,
    UserBirthday,
    UserJoiningDateAnniversary,

    // Enum values for customer interaction.
    CustomerCreation,
    CustomerModification,
    CustomerDeletion,
    CustomerBirthday,

    // Enum values for brand interaction.
    BrandCreation,
    BrandModification,
    BrandDeletion,

    // Enum values for product interaction.
    ProductCreation,
    ProductModification,
    ProductDeletion,

    // Enum values for product category interaction.
    ProductCategoryCreation,
    ProductCategoryModification,
    ProductCategoryDeletion,

    // Enum values for expense interaction.
    ExpenseCreation,
    ExpenseModification,
    ExpenseDeletion,

    // Enum values for supply interaction.
    SupplyCreation,
    SupplyModification,
    SupplyDeletion,

    // Enum values for consultant interaction.
    ConsultantCreation,
    ConsultantModification,
    ConsultantDeletion,

    // Enum values for order interaction.
    OrderCreation,
    OrderModification,
    OrderDeletion,

    // Enum values for treatment interaction.
    TreatmentCreation,
    TreatmentModification,
    TreatmentDeletion,

    // Enum values for debt incurrence interaction
    DebtIncurrenceCreation,
    DebtIncurrenceModification,
    DebtIncurrenceDeletion,

    // Enum values for debt payment interaction.
    DebtPaymentCreation,
    DebtPaymentModification,
    DebtPaymentDeletion,

    // Enum values for announcement interaction.
    AnnouncementCreation,
    AnnouncementModification,
    AnnouncementDeletion
}

export enum ResourceAccessMode {
    Detail,
    Update
}

export enum TransactionDirection {
    In,
    Out
}

export enum TransactionType {
    Supply,
    Expense,
    Consultant,
    Order,
    Treatment,
    DebtIncurrence,
    DebtPayment
} 