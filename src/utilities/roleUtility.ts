export class RoleUtility {
    getRoleBootstrapColor(roleName: string): string {
        const roleColors = {
            Developer: "danger",
            Manager: "primary",
            Accountant: "success",
            Staff: "secondary"
        };
        return roleColors[roleName as keyof typeof roleColors];
    }

    getRoleBootstrapIconClassName(roleName: string): string {
        const roleIcons = {
            Developer: "bi bi-wrench",
            Manager: "bi bi-star-fill",
            Accountant: "bi bi-star-half",
            Staff: "bi bi-star"
        };
        return roleIcons[roleName as keyof typeof roleIcons];
    }
}

export function useRoleUtility() {
    return new RoleUtility();
}