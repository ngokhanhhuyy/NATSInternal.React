import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { UserDetailModel } from "@models/user/userDetailModel";
import { usePhotoUtility } from "@/utilities/photoUtility";
import * as styles from "./AvatarAndNamesComponent.module.css";

// Placeholder.
import PlaceholderText from "@/views/shared/placeholder/PlaceholderTextComponent";
import PlaceholderLink from "@/views/shared/placeholder/PlaceholderLinkComponent";

// Component.
const AvatarAndNames = ({ model }: { model: UserDetailModel | undefined }) => {
    // Dependencies.
    const photoUtility = useMemo(usePhotoUtility, []);

    // Computed.
    const getAvatarUrl = () => {
        if (model) {
            return model.personalInformation?.avatarUrl ?? "https://placehold.co/256x256";
        }

        return photoUtility.getDefaultPlainPhotoUrl();
    };
    
    return (
        <div className={`block bg-white rounded-3 overflow-hidden border border-primary-subtle
                        row ${styles["avatarNamesBlock"]}`}>

            {/* Upper */}
            <div className={`col col-12 bg-primary-subtle border-bottom border-primary p-0
                            ${styles["upper"]} `}>
                {/* Avatar */}
                <img className={`img-thumbnail border-primary-subtle ${styles["avatar"]}`}
                        src={getAvatarUrl()}  />
            </div>

            {/* Lower */}
            <div className={`col bg-white d-flex ${styles["lower"]}`}>
                {/* NamesContainer */}
                <div className={`d-flex flex-column flex-fill ${styles["namesContainer"]}`}>

                    {/* FullName */}
                    <span className={`${styles["fullName"]} fs-5`}>
                        {model && model.personalInformation?.fullName}
                        {!model && <PlaceholderText width={150} />}
                    </span>

                    {/* UserName */}
                    <span className={styles["userName"]}>
                        {model && `@${model.userName}`}
                        {!model && <PlaceholderText width={100} />}
                    </span>

                </div>
            </div>

            {/* ActionButtonContainer */}
            <div className={`col col-md-auto col-sm-12 col-12 px-3 pt-md-0 pt-2 pb-md-0 pb-3
                            ${styles["actionButtonContainer"]}`}>

                {/* EditLink */}
                {(!model || model.authorization.canEdit) && (
                    <PlaceholderLink to={model?.updateRoute} isPlaceholder={!model}
                            className="btn btn-outline-primary btn-sm m-1">
                        <i className="bi bi-pencil-square"></i>
                        <span className="ms-2">Chỉnh sửa</span>
                    </PlaceholderLink>
                )}

                {/* ChangePasswordLink */}
                {model?.authorization.canChangePassword && (
                    <Link to={model.passwordChangeRoute}
                            className="btn btn-outline-primary btn-sm m-1">
                        <i className="bi bi-key"></i>
                        <span className="ms-2">Đổi mật khẩu</span>
                    </Link>
                )}

                {/* ResetPasswordLink */}
                {(!model || model.authorization.canResetPassword) && (
                    <PlaceholderLink to={model?.passwordResetRoute} isPlaceholder={!model}
                            className="btn btn-outline-primary btn-sm m-1">
                        <i className="bi bi-key"></i>
                        <span className="ms-2">Đặt lại mật khẩu</span>
                    </PlaceholderLink>
                )}

            </div>
        </div>
    );
};

export default AvatarAndNames;