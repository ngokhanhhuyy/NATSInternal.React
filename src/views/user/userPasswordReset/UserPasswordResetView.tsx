import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUserService } from "@/services/userService";
import { UserPasswordResetModel } from "@/models/user/userPasswordResetModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useRouteGenerator } from "@/router/routeGenerator";
import { AuthorizationError } from "@/errors";

// Layout components.
import UpsertViewContainer from "@/views/layouts/UpsertViewContainerComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import PasswordInput from "@/views/form/PasswordInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";
import SubmitButton from "@/views/form/SubmitButtonComponent";

// Component.
const UserPasswordResetView = ({ id }: { id: number }) => {
    // Dependency.
    const navigate = useNavigate();
    const userService = useMemo(() => useUserService(), []);
    const routeGenerator = useMemo(() => useRouteGenerator(), []);

    // Model and states.
    const initialModel = useAsyncModelInitializer({
        initializer: async () => {
            const canReset = await userService.getResetPasswordPermissionAsync(id);
            if (!canReset) {
                throw new AuthorizationError();
            }

            return new UserPasswordResetModel(id);
        },
        cacheKey: "userPasswordReset"
    });
    const { modelState } = useUpsertViewStates();
    const [model, setModel] = useState(() => initialModel);
    const isModelDirty = useDirtyModelChecker(initialModel, model);

    // Callbacks.
    const handleSubmissionAsync = async (): Promise<void> => {
        await userService.resetPasswordAsync(id, model.toRequestDto());
    };

    const handleSucceededSubmissionAsync = async (): Promise<void> => {
        await navigate(routeGenerator.getUserProfileRoutePath(id));
    };

    return (
        <UpsertViewContainer
            formId="userCreateForm"
            modelState={modelState}
            submittingAction={handleSubmissionAsync}
            onSubmissionSucceeded={handleSucceededSubmissionAsync}
            isModelDirty={isModelDirty}
        >
            <div className="row g-3">
                <div className="col col-12">
                    <MainBlock title="Đặt lại mật khẩu" bodyClassName="row g-3" closeButton>
                        {/* New Password */}
                        <div className="col col-sm-6 col-12">
                            <div className="form-group">
                                <Label text="Mật khẩu mới" required />
                                <PasswordInput
                                    name="newPassword"
                                    placeholder="Mật khẩu mới"
                                    maxLength={20}
                                    value={model.newPassword}
                                    onValueChanged={newPassword => {
                                        setModel(m => m.from({ newPassword }));
                                    }}
                                />
                                <ValidationMessage name="newPassword" />
                            </div>
                        </div>

                        {/* Confirmation Password */}
                        <div className="col col-sm-6 col-12">
                            <div className="form-group">
                                <Label text="Mật khẩu xác nhận" required />
                                <PasswordInput
                                    name="confirmationPassword"
                                    placeholder="Mật khẩu xác nhận"
                                    maxLength={20}
                                    value={model.confirmationPassword}
                                    onValueChanged={confirmationPassword => {
                                        setModel(m => m.from({ confirmationPassword }));
                                    }}
                                />
                                <ValidationMessage name="confirmationPassword" />
                            </div>
                        </div>
                    </MainBlock>
                </div>
            </div>
                
            <div className="row g-3 justify-content-end">
                {/* Submit button */}
                <div className="col col-auto">
                    <SubmitButton />
                </div>
            </div>
        </UpsertViewContainer>
    );
};

export default UserPasswordResetView;