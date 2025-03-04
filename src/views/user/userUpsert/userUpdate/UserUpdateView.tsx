import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserService } from "@/services/userService";
import { UserUpdateModel } from "@/models/user/userUpdateModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { AuthorizationError } from "@/errors";

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
    const userService = useUserService();
    const routeGenerator = useRouteGenerator();
    const roleOptions = useInitialDataStore(store => store.data.role.allAsOptions);

    // Model and states.
    const { isInitialRendering, modelState } = useUpsertViewStates();
    const initialModel = useAsyncModelInitializer({
        initializer: async () => {
            const responseDto = await userService.getDetailAsync(id);
            if (!responseDto.authorization.canEdit) {
                throw new AuthorizationError();
            }

            return new UserUpdateModel(responseDto, roleOptions);
        },
        cacheKey: "userUpdate"
    });
    const [model, setModel] = useState(() => initialModel);
    const isModelDirty = useDirtyModelChecker(initialModel, model);

    // Computed.
    const shouldRenderUserUserInformation = (() => {
        return model.authorization?.canEditUserUserInformation;
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
            submittingAction={handleSubmissionAsync}
            onSubmissionSucceeded={handleSucceededSubmissionAsync}
            deletingAction={handleDeletionAsync}
            onDeletionSucceeded={handleSucceededDeletionAsync}
            isModelDirty={isModelDirty}
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
                            roundedBottom={!shouldRenderUserUserInformation}
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
                        {shouldRenderUserUserInformation && (
                            <UserUserInfoUpsert
                                model={model.userInformation}
                                onModelChanged={(changedData => {
                                    setModel(model => model.from({
                                        userInformation: model.userInformation
                                            .from(changedData)
                                    }));
                                })}
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