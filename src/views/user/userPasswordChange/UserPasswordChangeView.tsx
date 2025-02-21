import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserService } from "@/services/userService";
import { UserPasswordChangeModel } from "@/models/user/userPasswordChangeModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useCurrentUserStore } from "@/stores/currentUserStore";
import { useRouteGenerator } from "@/router/routeGenerator";

// Layout components.
import UpsertViewContainer from "@/views/layouts/UpsertViewContainerComponent";
import MainBlock from "@layouts/MainBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import PasswordInput from "@/views/form/PasswordInputComponent";
import SubmitButton from "@/views/form/SubmitButtonComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Component.
const UserPasswordChangeView = () => {
    // Dependencies.
    const navigate = useNavigate();
    const currentUserStore = useCurrentUserStore();
    const service = useUserService();
    const routeGeneator = useRouteGenerator();

    // Model.
    const [model, setModel] = useState(() => new UserPasswordChangeModel());
    const { isInitialLoading, onInitialLoadingFinished, modelState } = useUpsertViewStates();
    const { isModelDirty, setOriginalModel } = useDirtyModelChecker(model);

    // Effect.
    useEffect(() => {
        setOriginalModel(model);
        setTimeout(onInitialLoadingFinished, 300);
    }, []);

    // Callbacks.
    const handleSubmissionAsync = async () => {
        await service.changePasswordAsync(model.toRequestDto());
    };

    const handleSucceededSubmissionAsync = useCallback(async () => {
        const user = await currentUserStore.getAsync();
        await navigate(routeGeneator.getUserProfileRoutePath(user.id));
    }, [currentUserStore.user]);

    return (
        <UpsertViewContainer
            formId="userCreateForm"
            modelState={modelState}
            isInitialLoading={isInitialLoading}
            submittingAction={handleSubmissionAsync}
            onSubmissionSucceeded={handleSucceededSubmissionAsync}
            isModelDirty={isModelDirty}
        >
            <div className="row g-3 justify-content-end">
                <div className="col col-12">
                    <MainBlock title="Đổi mật khẩu" bodyClassName="row g-3" closeButton>
                        {/* Current Password */}
                        <div className="col col-12">
                            <div className="form-group">
                                <Label text="Mật khẩu hiện tại" required />
                                <PasswordInput
                                    name="currentPassword"
                                    placeholder="Mật khẩu" maxLength={20}
                                    value={model.currentPassword}
                                    onValueChanged={currentPassword => {
                                        setModel(m => m.from({ currentPassword }));
                                    }}
                                />
                                <ValidationMessage name="currentPassword" />
                            </div>
                        </div>

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

export default UserPasswordChangeView;