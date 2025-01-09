import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthenticationService } from "@/services/authenticationService";
import { UserDetailModel } from "@/models/userModels";
import { useAuthenticationStore } from "@/stores/authenticationStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useAvatarUtility } from "@/utilities/avatarUtility";
import { useRouteGenerator } from "@/router/routeGenerator";
import * as styles from "./CurrentUserComponent.module.css";

const CurrentUser = () => {
    const authenticationService = useAuthenticationService();
    const avatarUtility = useAvatarUtility();
    const routeGenerator = useRouteGenerator();
    const authStore = useAuthenticationStore();
    const initialDataStore = useInitialDataStore();
    const navigate = useNavigate();
    const [model,] = useState(new UserDetailModel(initialDataStore.data.user.detail));

    // Memo.
    const avatarUrl = useMemo(() => {
        if (model!.personalInformation?.avatarUrl == null) {
            return avatarUtility
                .getDefaultAvatarUrlByFullName(model.personalInformation!.fullName!);
        }
        return model!.personalInformation!.avatarUrl;
    }, []);

    // Effect.
    useEffect(() => {
        return () => {
            authStore.clearAuthenticationStatus();
            initialDataStore.clearData();
        };
    }, []);

    // Callbacks.
    async function onProfileButtonClicked(): Promise<void> {
        await navigate(routeGenerator.getUserProfileRoutePath(model.id));
    }

    async function onUpdateButtonClicked(): Promise<void> {
        await navigate(routeGenerator.getUserUpdateRoutePath(model.id));
    }

    async function onPasswordChangeButtonClicked(): Promise<void> {
        await navigate(routeGenerator.getUserPasswordChangeRoutePath());
    }

    async function onLogoutButtonClick() {
        await authenticationService.signOutAsync();
        await navigate(routeGenerator.getSignInRoutePath());
    }

    return (
        <div className={`${styles["currentUserContainer"]} dropdown d-flex flex-row h-100
                        justify-content-end align-items-center`}>
            <div className="d-md-flex d-sm-none d-none flex-column align-items-end
                            justify-content-center">
                <div className={styles["fullName"]}>
                    {model!.personalInformation!.fullName}
                </div>
                <div className={styles["userName"]}>
                    @{ model!.userName }
                </div>
            </div>
            <button className={`btn p-0 ms-2 avatar-container focus-ring
                                ${styles["avatarContainer"]}`}
                    type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src={avatarUrl} className={`avatar ${styles["avatar"]}`} />
            </button>
            <div className={`dropdown-menu dropdown-menu-end border-primary-subtle
                            shadow p-0 overflow-hidden ${styles["dropdownMenu"]}`}>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item" onClick={onProfileButtonClicked}>
                        <i className="bi bi-person-badge me-3"></i>
                        <span>Trang cá nhân</span>
                    </li>
                    <li className="list-group-item" onClick={onUpdateButtonClicked}>
                        <i className="bi bi-box-arrow-right me-3"></i>
                        <span>Sửa hồ sơ</span>
                    </li>
                    <li className="list-group-item" onClick={onPasswordChangeButtonClicked}>
                        <i className="bi bi-asterisk me-3"></i>
                        <span>Đổi mật khẩu</span>
                    </li>
                    <li className="list-group-item" onClick={onLogoutButtonClick}>
                        <i className="bi bi-box-arrow-right me-3"></i>
                        <span className="text-danger">Đăng xuất</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CurrentUser;