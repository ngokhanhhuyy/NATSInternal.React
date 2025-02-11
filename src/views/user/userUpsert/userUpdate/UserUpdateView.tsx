import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserService } from "@/services/userService";
import { UserUpdateModel } from "@/models/user/userUpdateModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { NotFoundError } from "@/errors";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import SubmitButton from "@/views/form/SubmitButtonComponent";
import DeleteButton from "@/views/form/DeleteButtonComponent";

// Child components.
import UserPersonalInfoUpsert from "../UserPersonalInfoUpsertComponent";
import UserUserInfoUpsert from "../UserUserInfoUpsertComponent";
import UpsertViewContainer from "@/views/layouts/UpsertViewContainerComponent";

// Component.
const UserUpdateView = ({ id }: { id: number }) => {
    // Dependency.
    const navigate = useNavigate();
    const userService = useMemo(() => useUserService(), []);
    const routeGenerator = useMemo(() => useRouteGenerator(), []);
    const alertModalStore = useAlertModalStore();

    // Internal states.
    const {
        modelState,
        isInitialLoading,
        onInitialLoadingFinished,
        initialData } = useUpsertViewStates();
    const [model, setModel] = useState(() => {
        return new UserUpdateModel(initialData.role.allAsOptions);
    });

    // Effect.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseDto = await userService.getDetailAsync(id);
                setModel(model => model.fromResponseDto(responseDto));
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    await navigate(routeGenerator.getUserListRoutePath());
                    return;
                }

                throw error;
            } finally {
                onInitialLoadingFinished();
            }
        };

        fetchData();
    }, []);

    // Memo.
    const isPersonalInformationBlockRounded = (() => {
        return model.authorization?.canEditUserUserInformation ?? false;
    })();

    const shouldRenderUserUserInformation = (() => {
        return isInitialLoading || model.authorization?.canEditUserUserInformation;
    })();

    // Callbacks.
    const handleSubmissionAsync = async (): Promise<number> => {
        await userService.updateAsync(model.id, model.toRequestDto());
        return model.id;
    };

    const handleSucceededSubmissionAsync = async (submissionResult: number) => {
        await navigate(routeGenerator.getUserProfileRoutePath(submissionResult));
    };

    const handleDeletionAsync = async (): Promise<void> => {
        await userService.deleteAsync(model.id);
    };

    const handleSucceededDeletionAsync = async (): Promise<void> => {
        await navigate(routeGenerator.getUserListRoutePath());
    };

    return (
        <UpsertViewContainer
            formId="userCreateForm"
            modelState={modelState}
            isInitialLoading={isInitialLoading}
            submittingAction={handleSubmissionAsync}
            onSubmissionSucceeded={handleSucceededSubmissionAsync}
            deletingAction={handleDeletionAsync}
            onDeletionSucceeded={handleSucceededDeletionAsync}
        >
            <div className="row g-3">
                <div className="col col-12 justify-content-end">
                    <MainBlock
                        title="Chỉnh sửa nhân viên"
                        closeButton
                        bodyPadding={0}
                        bodyBorder={false}
                    >
                        {/* Personal information */}
                        <UserPersonalInfoUpsert
                            borderTop={false}
                            roundedBottom={isPersonalInformationBlockRounded}
                            model={model.personalInformation}
                            setModel={arg => {
                                if (typeof arg === "function") {
                                    setModel(model => model.from({
                                        personalInformation: arg(model.personalInformation)
                                    }));
                                } else {
                                    setModel(model => model.from({
                                        personalInformation: arg
                                    }));
                                }
                            }}
                        />

                        {/* User information */}
                        {shouldRenderUserUserInformation && (
                            <UserUserInfoUpsert
                                model={model.userInformation}
                                setModel={arg => {
                                    if (typeof arg === "function") {
                                        setModel(model => model.from({
                                            userInformation: arg(model.userInformation)
                                        }));
                                    } else {
                                        setModel(model => model.from({
                                            userInformation: arg
                                        }));
                                    }
                                }}
                            />
                        )}
                    </MainBlock>
                </div>
            </div>
            
            <div className="row g-3 justify-content-end">
                {/* Delete button */}
                {model.authorization?.canDelete && (
                    <div className="col col-auto">
                        <DeleteButton />
                    </div>
                )}

                {/* Edit button */}
                {model.authorization?.canEdit && (
                    <div className="col col-auto">
                        <SubmitButton />
                    </div>
                )}
            </div>
        </UpsertViewContainer>
    );
};

export default UserUpdateView;