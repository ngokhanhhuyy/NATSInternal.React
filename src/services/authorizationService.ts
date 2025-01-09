import { useCurrentUserStore } from "@/stores/currentUser";
import { PermissionConstants } from "@/constants/permissionConstants";
import { RoleConstants } from "@/constants/roleConstants";

type PermissionSelector = (permissions: typeof PermissionConstants) => string;

export interface IAuthorizationService {
    // User.
    canCreateUser(): boolean,
    canEditUser(userId: number, powerLevel: number): boolean,
    canEditUserPersonalInformation(userId: number, powerLevel: number): boolean,
    canEditUserUserInformation(userId: number, powerLevel: number): boolean,
    canChangeUserPassword(userId: number): boolean,
    canResetUserPassword(userId: number, powerLevel: number): boolean,
    canDeleteUser(userId: number, powerLevel: number): boolean,
    canRestoreUser(userId: number): boolean,
    canAssignToRole(rolePowerLevel: number): boolean,
    canGetNote(powerLevel: number): boolean;
    // Supply.
    canCreateSupply(): boolean;
    canEditSupply(): boolean;
    canDeleteSupply(): boolean;
    canSetSupplyStatsDateTime(): boolean;
    // Expense.
    canCreateExpense(): boolean;
    canEditExpense(): boolean;
    canDeleteExpense(): boolean;
    canSetExpenseStatsDateTime(): boolean;
    // Order.
    canCreateOrder(): boolean;
    canEditOrder(): boolean;
    canDeleteOrder(): boolean;
    canSetOrderStatsDateTime(): boolean;
    // DebtIncurrence.
    canCreateDebt(): boolean;
    canEditDebt(): boolean;
    canDeleteDebt(): boolean;
    canSetDebtIncurrenceStatsDateTime(): boolean;
    // DebtPayment.
    canCreateDebtPayment(): boolean;
    canEditDebtPayment(): boolean;
    canDeleteDebtPayment(): boolean;
    canSetDebtPaymentStatsDateTime(): boolean;
    // Consultant.
    canCreateConsultant(): boolean;
    canEditConsultant(): boolean;
    canDeleteConsultant(): boolean;
    canSetConsultantStatsDateTime(): boolean;
    // Treatment.
    canCreateTreatment(): boolean;
    canEditTreatment(): boolean;
    canDeleteTreatment(): boolean;
    canSetTreatmentStatsDateTime(): boolean;
    // Permission.
    hasPermission(arg: string | PermissionSelector): boolean
}

export function useAuthorizationService(): IAuthorizationService {
    const currentUserStore = useCurrentUserStore();
    const thisUser = currentUserStore.user!;

    function isThisUserDeveloper(): boolean {
        return thisUser.userInformation!.role!.name == RoleConstants.Developer;
    };

    function isThisUserManager(): boolean {
        return thisUser.userInformation!.role!.name == RoleConstants.Manager;
    }

    function thisUserPowerLevel(): number {
        return thisUser.userInformation!.role!.powerLevel;
    }

    return {
        // User.
        canCreateUser(): boolean {
            return this.hasPermission(PermissionConstants.CreateUser);
        },

        canEditUser(userId: number, powerLevel: number): boolean {
            if (thisUser == null) {
                return false;
            }
    
            const isSelf = thisUser.id === userId;
            const canEditSelfPersonalInformation = this
                .hasPermission(PermissionConstants.EditSelfPersonalInformation);
            const canEditSelfUserInformation  = this
                .hasPermission(PermissionConstants.EditSelfUserInformation);
            if (isSelf && (canEditSelfPersonalInformation || canEditSelfUserInformation)) {
                return true; 
            }
            if (isThisUserDeveloper() || isThisUserManager()) {
                if (thisUserPowerLevel() <= powerLevel) {
                    return false;
                }
                return true;
            }
    
            return false;
        },

        canEditUserPersonalInformation(userId: number, powerLevel: number): boolean {
            if (thisUser.id == userId &&
                    this.hasPermission(PermissionConstants.EditSelfPersonalInformation)) {
                return true;
            } else if (this.hasPermission(PermissionConstants.EditOtherUserUserInformation)
                    && thisUserPowerLevel() > powerLevel) {
                return true;
            }
            return false;
        },

        canEditUserUserInformation(userId: number, powerLevel: number): boolean {
            if (thisUser.id == userId &&
                    this.hasPermission(PermissionConstants.EditSelfUserInformation)) {
                return true;
            } else if (this.hasPermission(PermissionConstants.EditOtherUserUserInformation)
                    && thisUserPowerLevel() > powerLevel) {
                return true;
            }
            return false;
        },

        canChangeUserPassword(userId: number): boolean {
            return thisUser.id === userId;
        },

        canResetUserPassword(userId: number, powerLevel: number): boolean {
            return thisUser.id != userId &&
                this.hasPermission(PermissionConstants.ResetOtherUserPassword) &&
                thisUserPowerLevel() > powerLevel;
        },

        canDeleteUser(userId: number, powerLevel: number): boolean {
            return thisUser.id != userId &&
                this.hasPermission(PermissionConstants.DeleteUser) &&
                thisUserPowerLevel() > powerLevel;
        },

        canRestoreUser(userId: number): boolean {
            return thisUser.id != userId &&
                this.hasPermission(PermissionConstants.RestoreUser);
        },

        canAssignToRole(rolePowerLevel: number): boolean {
            return isThisUserDeveloper() ||
                isThisUserDeveloper() ||
                thisUserPowerLevel() > rolePowerLevel;
        },

        canGetNote(powerLevel: number): boolean {
            return this.hasPermission(PermissionConstants.GetOtherUserNote) &&
                thisUserPowerLevel() > powerLevel;
        },

        // Supply.
        canCreateSupply(): boolean {
            return this.hasPermission(PermissionConstants.CreateSupply);
        },

        canEditSupply(): boolean {
            return this.hasPermission(PermissionConstants.EditSupply);
        },

        canDeleteSupply(): boolean {
            return this.hasPermission(PermissionConstants.DeleteSupply);
        },
        
        canSetSupplyStatsDateTime(): boolean {
            return this.hasPermission(PermissionConstants.CanSetSupplyStatsDateTime);
        },

        // Expense.
        canCreateExpense(): boolean {
            return this.hasPermission(PermissionConstants.CreateExpense);
        },

        canEditExpense(): boolean {
            return this.hasPermission(PermissionConstants.EditExpense);
        },

        canDeleteExpense(): boolean {
            return this.hasPermission(PermissionConstants.DeleteExpense);
        },

        canSetExpenseStatsDateTime(): boolean {
            return this.hasPermission(PermissionConstants.CanSetExpenseStatsDateTime);
        },

        // Order.
        canCreateOrder(): boolean {
            return this.hasPermission(PermissionConstants.CreateOrder);
        },

        canEditOrder(): boolean {
            return this.hasPermission(PermissionConstants.EditOrder);
        },

        canDeleteOrder(): boolean {
            return this.hasPermission(PermissionConstants.DeleteOrder);
        },
        
        canSetOrderStatsDateTime(): boolean {
            return this.hasPermission(PermissionConstants.SetOrderStatsDateTime);
        },

        // Debt.
        canCreateDebt(): boolean {
            return this.hasPermission(PermissionConstants.CreateDebtIncurrence);
        },

        canEditDebt(): boolean {
            return this.hasPermission(PermissionConstants.EditDebtIncurrence);
        },

        canDeleteDebt(): boolean {
            return this.hasPermission(PermissionConstants.DeleteDebtIncurrence);
        },

        canSetDebtIncurrenceStatsDateTime(): boolean {
            return this.hasPermission(PermissionConstants.SetDebtIncurrenceCreatedDateTime);
        },

        // DebtPayment.
        canCreateDebtPayment(): boolean {
            return this.hasPermission(PermissionConstants.CreateDebtPayment);
        },

        canEditDebtPayment(): boolean {
            return this.hasPermission(PermissionConstants.EditDebtPayment);
        },

        canDeleteDebtPayment(): boolean {
            return this.hasPermission(PermissionConstants.DeleteDebtPayment);
        },

        canSetDebtPaymentStatsDateTime(): boolean {
            return this.hasPermission(PermissionConstants.SetDebtPaymentStatsDateTime);
        },

        // Consultant.
        canCreateConsultant(): boolean {
            return this.hasPermission(PermissionConstants.CreateConsultant);
        },

        canEditConsultant(): boolean {
            return this.hasPermission(PermissionConstants.EditConsultant);
        },

        canDeleteConsultant(): boolean {
            return this.hasPermission(PermissionConstants.DeleteConsultant);
        },

        canSetConsultantStatsDateTime() {
            return this.hasPermission(PermissionConstants.SetConsultantStatsDateTime);
        },

        // Treatment.
        canCreateTreatment(): boolean {
            return this.hasPermission(PermissionConstants.CreateTreatment);
        },

        canEditTreatment(): boolean {
            return this.hasPermission(PermissionConstants.EditTreatment);
        },

        canDeleteTreatment(): boolean {
            return this.hasPermission(PermissionConstants.DeleteTreatment);
        },

        canSetTreatmentStatsDateTime() {
            return this.hasPermission(PermissionConstants.SetTreatmentStatsDateTime);
        },

        hasPermission(arg: string | PermissionSelector): boolean {
            let permission: string;
            if (typeof arg === "function") {
                permission = arg(PermissionConstants);
            } else {
                permission = arg;
            }
            return thisUser.userInformation!.role!.permissions!.includes(permission);
        },
    };
}