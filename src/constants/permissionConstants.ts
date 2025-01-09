export class PermissionConstants {
    // Permissions to interact with users.
    public static readonly CreateUser = "CreateUser";
    public static readonly GetOtherUserPersonalInformation = "GetOtherUserPersonalInformation";
    public static readonly GetOtherUserUserInformation = "GetOtherUserUserInformation";
    public static readonly GetOtherUserNote = "GetOtherUserNote";
    public static readonly EditSelfPersonalInformation = "EditSelfPersonalInformation";
    public static readonly EditSelfUserInformation = "EditSelfUserInformation";
    public static readonly EditOtherUserPersonalInformation = "EditOtherUserPersonalInformation";
    public static readonly EditOtherUserUserInformation = "EditOtherUserUserInformation";
    public static readonly AssignRole = "AssignRole";
    public static readonly ResetOtherUserPassword = "ResetOtherUserPassword";
    public static readonly DeleteUser = "DeleteUser";
    public static readonly RestoreUser = "RestoreUser";

    // Permissions to interact with customers.
    public static readonly GetCustomerDetail = "GetCustomerDetail";
    public static readonly CreateCustomer = "CreateCustomer";
    public static readonly EditCustomer = "EditCustomer";
    public static readonly DeleteCustomer = "DeleteCustomer";

    // Permissions to interact with brands.
    public static readonly CreateBrand = "CreateBrand";
    public static readonly EditBrand = "EditBrand";
    public static readonly DeleteBrand = "DeleteBrand";

    // Permissions to interact with products
    public static readonly CreateProduct = "CreateProduct";
    public static readonly EditProduct = "EditProduct";
    public static readonly DeleteProduct = "DeleteProduct";

    // Permissions to interact with product categories
    public static readonly CreateProductCategory = "CreateProductCategory";
    public static readonly EditProductCategory = "EditProductCategory";
    public static readonly DeleteProductCategory = "DeleteProductCategory";

    // Permissions to interact with supplies.
    public static readonly CreateSupply = "CreateSupply";
    public static readonly EditSupply = "EditSupply";
    public static readonly DeleteSupply = "DeleteSupply";
    public static readonly CanSetSupplyStatsDateTime = "CanSetSupplyStatsDateTime";

    // Permissions to interact with expenses.
    public static readonly CreateExpense = "CreateExpense";
    public static readonly EditExpense = "EditExpense";
    public static readonly DeleteExpense = "DeleteExpense";
    public static readonly CanSetExpenseStatsDateTime = "CanSetExpenseStatsDateTime";
    
    // Permissions to interact with orders.
    public static readonly CreateOrder = "CreateOrder";
    public static readonly EditOrder = "EditOrder";
    public static readonly DeleteOrder = "DeleteOrder";
    public static readonly SetOrderStatsDateTime = "SetOrderStatsDateTime";

    // Permissions to interact with debts.
    public static readonly CreateDebtIncurrence = "CreateDebtIncurrence";
    public static readonly EditDebtIncurrence = "EditDebtIncurrence";
    public static readonly DeleteDebtIncurrence = "DeleteDebtIncurrence";
    public static readonly SetDebtIncurrenceCreatedDateTime = "SetDebtIncurrenceStatsDateTime";

    // Permissions to interact with debt payments.
    public static readonly CreateDebtPayment = "CreateDebtPayment";
    public static readonly EditDebtPayment = "EditDebtPayment";
    public static readonly DeleteDebtPayment = "DeleteDebtPayment";
    public static readonly SetDebtPaymentStatsDateTime = "SetDebtPaymentStatsDateTime";

    // Permissions to interact with consultants.
    public static readonly CreateConsultant = "CreateConsultant";
    public static readonly EditConsultant = "EditConsultant";
    public static readonly DeleteConsultant = "DeleteConsultant";
    public static readonly SetConsultantStatsDateTime = "SetConsultantStatsDateTime";

    // Permissions to interact with treatments.
    public static readonly CreateTreatment = "CreateTreatment";
    public static readonly EditTreatment = "EditTreatment";
    public static readonly DeleteTreatment = "DeleteTreatment";
    public static readonly SetTreatmentStatsDateTime = "SetTreatmentStatsDateTime";
}