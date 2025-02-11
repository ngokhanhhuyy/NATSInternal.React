import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserService } from "@/services/userService";
import { UserCreateModel } from "@/models/user/userCreateModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { NotFoundError } from "@/errors";

// Layout components.
import UpsertViewContainer from "@/views/layouts/UpsertViewContainerComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import SubmitButton from "@/views/form/SubmitButtonComponent";

// Child components.
import AccountInformation from "./AccountInformationComponent";
import UserPersonalInfoUpsert from "../UserPersonalInfoUpsertComponent";
import UserUserInfoUpsert from "../UserUserInfoUpsertComponent";

// Component.
const UserCreateView = () => {
    // Dependencies.
    const userService = useMemo(() => useUserService(), []);
    const routeGenerator = useMemo(() => useRouteGenerator(), []);
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();

    // Model and states.
    const {
        modelState,
        isInitialLoading,
        onInitialLoadingFinished,
        initialData } = useUpsertViewStates();
    const [model, setModel] = useState(() => {
        const roleOptionsResponseDtos = initialData.role.allAsOptions;
        return new UserCreateModel(roleOptionsResponseDtos);
    });

    // Effect.
    useEffect(() => {
        const checkPermissionAsync = async () => {
            try {
                const canCreate = await userService.getCreatingPermissionAsync();
                if (!canCreate) {
                    await alertModalStore.getUnauthorizationConfirmationAsync();
                    await navigate(routeGenerator.getUserListRoutePath());
                };
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await navigate(routeGenerator.getUserListRoutePath());
                    return;
                }

                throw error;
            }
        };

        checkPermissionAsync().then(onInitialLoadingFinished);
    }, []);

    const handleSubmissionAsync = async (): Promise<number> => {
        return await userService.createAsync(model.toRequestDto());
    };
    
    const handleSucceededSubmissionAsync = async (submissionResult: number): Promise<void> => {
        await navigate(routeGenerator.getUserProfileRoutePath(submissionResult));
    };

    return (
        <UpsertViewContainer formId="userCreateForm" modelState={modelState}
                isInitialLoading={isInitialLoading}
                submittingAction={handleSubmissionAsync}
                onSubmissionSucceeded={handleSucceededSubmissionAsync}>
            <div className="row g-3 justify-content-end">
                <div className="col col-12">
                    <MainBlock title="Tạo nhân viên mới" closeButton
                            bodyPadding={0} bodyBorder={false}>
                        {/* Account information */}
                        <AccountInformation model={model} setModel={setModel} />

                        {/* Personal information */}
                        <UserPersonalInfoUpsert model={model.personalInformation}
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
                                }} />

                        {/* User information */}
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
                                }} />
                    </MainBlock>
                </div>
                
                {/* Action buttons */}
                <div className="col col-auto">
                    <div className="col col-auto p-0">
                        <SubmitButton />
                    </div>
                </div>
            </div>
        </UpsertViewContainer>
    );
};

export default UserCreateView;