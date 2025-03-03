import React, { useState, useMemo, startTransition } from "react";
import { Link } from "react-router-dom";
import { useUserService } from "@/services/userService";
import { UserListModel } from "@/models/user/userListModel";
import type { UserBasicModel } from "@models/user/userBasicModel";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { usePhotoUtility } from "@/utilities/photoUtility";
import { ValidationError } from "@/errors";
import * as styles from "./SecondaryListComponent.module.css";

// Layout component.
import MainBlock from "@layouts/MainBlockComponent";

// Interface and type.
type Mode = "JoinedRecently" | "UpcomingBirthday";

export interface SecondaryListProps {
    mode: Mode;
    initialModel: UserListModel;
    isInitialRendering: boolean;
}

const SecondaryList = (props: SecondaryListProps) => {
    // Dependencies.
    const userService = useMemo(() => useUserService(), []);
    const getUndefinedErrorConfirmationAsync = useAlertModalStore(store => {
        return store.getUndefinedErrorConfirmationAsync;
    });

    // Model and states.
    const [model, setModel] = useState<UserListModel>(() => props.initialModel);
    const [isReloading, setReloading] = useState<boolean>(false);

    // Computed.
    const blockTitle = useMemo<string>(() => {
        return props.mode === "JoinedRecently" ? "Mới gia nhập" : "Sinh nhật tháng này";
    }, [props.mode]);

    // Computed
    const computeResultNotFoundText = () => {
        if (props.mode === "JoinedRecently") {
            return "Không có nhân viên nào vừa gia nhập";
        }
    
        return "Không có nhân viên nào có sinh nhật sắp tới";
    };

    const computeItemListClassName = () => {
        return isReloading ? "opacity-50 pe-none" : "";
    };

    // Callback.
    const loadListAsync = (): void => {
        setReloading(true);
        startTransition(async () => {
            try {
                const responseDto = await userService.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            } catch (error) {
                if (error instanceof ValidationError) {
                    await getUndefinedErrorConfirmationAsync();
                    window.location.reload();
                    return;
                }
                
                throw error;
            } finally {
                setReloading(false);
            }
        });
    };

    // Header.
    const header = (
        <>
            {isReloading && (
                <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            )}

            <button className="btn btn-primary btn-sm"
                    disabled={isReloading}
                    onClick={loadListAsync}>
                <i className="bi bi-arrow-counterclockwise" />
            </button>
        </>
    );

    return (
        <MainBlock
            title={blockTitle}
            header={header}
            bodyClassName={styles["blockBody"]}
            bodyPadding={0}
        >
            <ul
                className={`list-group list-group-flush ${computeItemListClassName()}`}
                style={{ transition: "opacity .25s ease" }}
            >
                {/* Results */}
                {model.items.length > 0 && model.items.map(user => (
                    <Item mode={props.mode} model={user} key={user.id} />
                ))}

                {/* Fallback */}
                {model.items.length === 0 &&  (
                    <li className="d-flex align-items-center justify-content-center
                                    text-center p-3 opacity-50">
                        {computeResultNotFoundText()}
                    </li>
                )}
            </ul>
        </MainBlock>
    );
};

export default SecondaryList;

const Item = ({ mode, model }: { mode: Mode, model: UserBasicModel }) => {
    // Dependency.
    const photoUtility = useMemo(usePhotoUtility, []);

    // Computed.
    const computeDetailText = () => {
        if (!model) {
            return "";
        }

        const result = mode === "JoinedRecently" ? model.joiningDate! : model.birthday!;
        return result.date.split(", ")[0];
    };
    
    return (
        <li className="list-group-item d-flex flex-row align-items-center
                        bg-transparent px-3 py-2">
            {/* Avatar */}
            {model && (
                <Link to={model.detailRoute}>
                    <img
                        src={model.avatarUrl}
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px" }}
                    />
                </Link>
            )}
            {!model && (
                <img
                    src={photoUtility.getDefaultPlainPhotoUrl()}
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px" }}
                />
            )}

            {/* Name and detail text */}
            <div className={`d-flex flex-column flex-fill
                            align-items-start ${styles["name"]}`}>
                {/* Name */}
                <Link to={model.detailRoute}>
                    <span className="fw-bold">{ model.fullName }</span>
                </Link>

                {/* Detail text */}
                <span className="badge bg-success-subtle border border-success-subtle
                                text-success my-1 rounded small handled-orders fw-bold">
                    {computeDetailText()}
                </span>
            </div>
        </li>
    );
};