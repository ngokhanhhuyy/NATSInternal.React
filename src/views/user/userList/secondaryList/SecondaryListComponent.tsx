import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserService } from "@/services/userService";
import { UserListModel } from "@/models/user/userListModel";
import type { UserBasicModel } from "@models/user/userBasicModel";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { usePhotoUtility } from "@/utilities/photoUtility";
import * as styles from "./SecondaryListComponent.module.css";

// Layout component.
import MainBlock from "@layouts/MainBlockComponent";
import { ValidationError } from "@/errors";

// Form component.
import Button from "@/views/form/ButtonComponent";

// Interface and type.
type Mode = "JoinedRecently" | "UpcomingBirthday";

export interface SecondaryListProps {
    mode: Mode;
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
}

const SecondaryList = (props: SecondaryListProps) => {
    const { mode, isInitialLoading, onInitialLoadingFinished } = props;

    // Dependencies.
    const userService = useMemo(() => useUserService(), []);
    const alertModelStore = useAlertModalStore();

    // Model and states.
    const [model, setModel] = useState<UserListModel>(() => {
        let requestDto: RequestDtos.User.List;
        if (mode === "JoinedRecently") {
            requestDto = { joinedRecentlyOnly: true };
        } else {
            requestDto = { upcomingBirthdayOnly: true };
        }

        return new UserListModel(undefined, undefined, requestDto);
    });
    
    const [isReloading, setReloading] = useState<boolean>(false);

    // Computed.
    const blockTitle = useMemo<string>(() => {
        return mode === "JoinedRecently" ? "Mới gia nhập" : "Sinh nhật tháng này";
    }, [mode]);

    // Computed
    const computeResultNotFoundText = () => {
        if (mode === "JoinedRecently") {
            return "Không có nhân viên nào vừa gia nhập";
        }
    
        return "Không có nhân viên nào có sinh nhật sắp tới";
    };

    const computeItemListClassName = () => {
        return isReloading ? "opacity-50 pe-none" : "";
    };

    // Callback.
    const loadListAsync = async (): Promise<void> => {
        if (!isInitialLoading) {
            setReloading(true);
        }
        
        try {
            const responseDto = await userService.getListAsync(model.toRequestDto());
            setModel(model => model.fromListResponseDto(responseDto));
        } catch (error) {
            if (error instanceof ValidationError) {
                await alertModelStore.getSubmissionErrorConfirmationAsync();
                return;
            }
            
            throw error;
        } finally {
            setReloading(false);
        }
    };

    // Effect.
    useEffect(() => {
        loadListAsync().finally(onInitialLoadingFinished);
    }, []);

    if (isInitialLoading) {
        return null;
    }

    // Header.
    const header = (
        <>
            {isReloading && (
                <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            )}

            <Button className="btn btn-primary btn-sm"
                    isPlaceholder={isInitialLoading}
                    disabled={isReloading}
                    onClick={loadListAsync}>
                <i className="bi bi-arrow-counterclockwise" />
            </Button>
        </>
    );

    return (
        <MainBlock title={blockTitle} header={header}
                bodyClassName={styles["blockBody"]} bodyPadding={0}>
            <ul className={`list-group list-group-flush ${computeItemListClassName()}`}>
                {/* Results */}
                {model.items.length > 0 && model.items.map(user => (
                    <Item mode={mode} model={user} key={user.id} />
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
                    <img src={model.avatarUrl} style={{ width: "40px", height: "40px" }}
                            className="rounded-circle me-2" />
                </Link>
            )}
            {!model && (
                <img src={photoUtility.getDefaultPlainPhotoUrl()}
                        style={{ width: "40px", height: "40px" }}
                        className="rounded-circle me-2" />
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