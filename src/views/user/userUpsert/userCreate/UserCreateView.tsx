import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserService } from "@/services/userService";
import { UserCreateModel } from "@/models/user/userCreateModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { AuthorizationError } from "@/errors";

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
    const userService = useUserService();
    const routeGenerator = useRouteGenerator();
    const navigate = useNavigate();
    const roleOptions = useInitialDataStore(store => store.data.role.allAsOptions);

    // Model and states.
    const { isInitialRendering, modelState } = useUpsertViewStates();
    const initialModel = useAsyncModelInitializer({
        initializer: async () => {
            const canCreate = await userService.getCreatingPermissionAsync();
            if (!canCreate) {
                throw new AuthorizationError();
            };

            return new UserCreateModel(roleOptions);
        },
        cacheKey: "userCreate"
    });
    const [model, setModel] = useState(() => initialModel);
    const isModelDirty = useDirtyModelChecker(initialModel, model);

    // Callbacks.
    const handleSubmissionAsync = async (): Promise<number> => {
        return await userService.createAsync(model.toRequestDto());
    };
    
    const handleSucceededSubmissionAsync = async (submissionResult: number): Promise<void> => {
        await navigate(routeGenerator.getUserProfileRoutePath(submissionResult));
    };

    return (
        <UpsertViewContainer
            formId="userCreateForm"
            modelState={modelState}
            submittingAction={handleSubmissionAsync}
            onSubmissionSucceeded={handleSucceededSubmissionAsync}
            isModelDirty={isModelDirty}
        >
            <div className="row g-3 justify-content-end">
                <div className="col col-12">
                    <MainBlock title="Tạo nhân viên mới" closeButton
                            bodyPadding={0} bodyBorder={false}>
                        {/* Account information */}
                        <AccountInformation
                            model={model}
                            onModelChanged={(changedData) => {
                                setModel(model => model.from(changedData));
                            }}
                        />

                        {/* Personal information */}
                        <UserPersonalInfoUpsert
                            isInitialRendering={isInitialRendering}
                            model={model.personalInformation}
                            onModelChanged={(changedData => {
                                setModel(model => model.from({
                                    personalInformation: model.personalInformation
                                        .from(changedData)
                                }));
                            })}
                        />

                        {/* User information */}
                        <UserUserInfoUpsert
                            model={model.userInformation}
                            onModelChanged={(changedData) => {
                                setModel(model => model.from({
                                    userInformation: model.userInformation
                                        .from(changedData)
                                }));
                            }}
                        />
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