import React from "react";
import { Link } from "react-router-dom";
import { UserBasicModel } from "@models/userModels";
import { useRoleUtility } from "@/utilities/roleUtility";
import * as styles from "./ResultsItemComponent.module.css";

const roleUtility = useRoleUtility();

const ResultsItem = ({ model }: { model: UserBasicModel }) => {
    // Computed.
    const computeClassName = () => {
        if (!model) {
            return "placeholder-glow pe-none";
        }

        return "";
    };

    const computeBodyClassName = () => {
        return `border-${roleUtility.getRoleBootstrapColor(model?.role.name ?? "Staff")}`;
    };

    const computeFooterClassName = () => {
        const color = roleUtility.getRoleBootstrapColor(model?.role.name ?? "Staff");
        return `text-${color} bg-${color} bg-opacity-10 border-${color}-subtle`;
    };
    
    const computeIconClassName = () => {
        return roleUtility.getRoleBootstrapIconClassName(model?.role.name ?? "Staff");
    };

    return (
        <div className={`block bg-white d-flex flex-column bg-body rounded-3 h-100
                        ${computeClassName()}`}>
            <div className={`block-body flex-fill row rounded-top border border-bottom-0
                            border-default ${computeBodyClassName()} ${styles["blockBody"]}`}>
                {/* Avatar */}
                <div className="col col-12 d-flex justify-content-center p-3">
                    <div className={styles["avatarContainer"]}>
                        <Link to={model.detailRoute}>
                            <img src={model.avatarUrl} />
                        </Link>
                    </div>
                </div>
                
                {/* Names */}
                <div className="col col-12 pb-3">
                    <div className="identity-container d-flex flex-column
                                    align-items-center text-center">
                        <Link to={model.detailRoute}>
                            <span className="fullname fw-bold text-center">
                                { model.fullName }
                            </span>
                        </Link>
                        <span className="username small opacity-75">
                            @{ model.userName }
                        </span>
                    </div>
                </div>
            </div>
            <div className="block-footer d-flex flex-row justify-content-center
                            rounded-bottom p-0">
                <div className={`d-flex h-100 w-100 p-1 justify-content-center
                                rounded-bottom-3 border ${computeFooterClassName()}`}>
                    <span className="px-2">
                        <i className={computeIconClassName()}></i>
                    </span>
                    <span>{model.role.displayName}</span>
                </div>
            </div>
        </div>
    );
};

export default ResultsItem;