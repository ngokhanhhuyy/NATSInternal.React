import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthenticationService } from "@/services/authenticationService";
import { useAuthenticationStore } from "@/stores/authenticationStore";
import {
    BadRequestError,
    ConnectionError,
    InternalServerError,
    OperationError } from "@/errors";
import { SignInModel } from "@/models/signInModels";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";

// Form components.
import ValidationMessage from "./ValidationMessageComponent";
import Input from "./InputComponent";

function SignInView() {
    // Dependencies.
    const navigate = useNavigate();
    const { returningPath } = useParams();
    const authenticationService = useAuthenticationService();
    const authenticationStore = useAuthenticationStore();

    // Model and state.
    const [model, setModel] = useState(() => new SignInModel());
    const [commonError, setCommonError] = useState<string | null>(null);
    const [isSignedIn, setSignedIn] = useState<boolean>(false);
    const [isInitiallyChecking, setInitiallyChecking] = useState(true);
    const [isSubmitting, setSubmitting] = useState<boolean>(() => false);
    const { modelState } = useUpsertViewStates();

    // Effect.
    useEffect(() => {
        authenticationStore
            .isAuthenticatedAsync()
            .then(authenticated => {
                if (authenticated) {
                    const targetPath = returningPath || "/";
                    navigate(targetPath, { replace: true });
                }
            }).finally(() => {
                setInitiallyChecking(false);
            });
    }, []);

    if (isInitiallyChecking) {
        return null;
    }

    // Callbacks.
    function isRequiredFieldsFilled(): boolean {
        const userNameFilled = model.userName.length > 0;
        const passwordFilled = model.password.length > 0;
        return !(!userNameFilled || !passwordFilled);
    }

    async function login(): Promise<void> {
        setSubmitting(true);
        setCommonError(null);
        modelState.resetErrors();
        try {
            await authenticationService.signInAsync(model.toRequestDto());
            authenticationStore.isAuthenticated = true;
            setSignedIn(true);
            setTimeout(() => {
                if (returningPath) {
                    navigate(returningPath);
                } else {
                    navigate("/");
                }
            }, 1000);
        } catch (exception) {
            setModel(model.from({ password: "" }));
            if (exception instanceof BadRequestError ||
                    exception instanceof OperationError) {
                modelState.setErrors(exception.errors);
            } else if (exception instanceof InternalServerError) {
                setCommonError("Đã xảy ra lỗi từ máy chủ");
            } else if (exception instanceof ConnectionError) {
                setCommonError("Không thể kết nối đến máy chủ");
            } else {
                setCommonError("Đã xảy ra lỗi không xác định");
                throw exception;
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function onEnterKeyPressed(): Promise<void> {
        if (isRequiredFieldsFilled()) {
            await login();
        }
    }

    return (
        <div className="container-fluid d-flex flex-column flex-fill justify-content-center"
                style={{ width: "100vw", maxWidth: "100%", minHeight: "100%" }}
                onKeyUp={(event) => event.key === "Enter" && onEnterKeyPressed()}>
            <div className="row py-3 g-3 justify-content-center">
                <div className="col col-xxl-4 col-xl-4 col-lg-5 col-md-6 col-sm-8
                                col-12 d-flex align-items-center">
                    <div className="block bg-white border border-primary-subtle rounded-3
                                    shadow-sm w-100 p-3">
                        {/* Username */}
                        <div className="form-group mb-3">
                            <div className="form-floating">
                                <Input modelErrorState={modelState} value={model.userName}
                                        onValueChanged={userName => {
                                            setModel(m => m.from({ userName }));
                                        }}
                                        propertyName="userName" >
                                </Input>
                                <label className="form-label bg-transparent fw-normal">
                                    Tên tài khoản
                                </label>
                            </div>
                            <ValidationMessage name="userName" modelState={modelState} />
                        </div>

                        {/* Password */}
                        <div className="form-group mb-3">
                            <div className="form-floating">
                                <Input modelErrorState={modelState} value={model.password}
                                        onValueChanged={password => {
                                            setModel(m => m.from({ password }));
                                        }}
                                        propertyName="password" >
                                </Input>
                                <label className="form-label bg-transparent fw-normal">
                                    Mật khẩu
                                </label>
                            </div>
                            <ValidationMessage name="password" modelState={modelState} />
                        </div>
                        <div className="form-group">
                            <SignInButton isSignedIn={isSignedIn}
                                    isSubmitting={isSubmitting}
                                    isDisabled={!isRequiredFieldsFilled()}
                                    onClick={login} />
                            <CommonError commonError={commonError} />
                            {isSignedIn && (
                                <span className="alert alert-success d-flex
                                                justify-content-center w-100">
                                    <i className="bi bi-check-circle-fill me-1"></i>
                                    Đăng nhập thành công!
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CommonError = ({commonError}: { commonError: string | null }) => {
    if (!commonError) {
        return null;
    }

    return (
        <span className="alert alert-danger d-flex justify-content-center mt-3 w-100">
            <i className="bi bi-exclamation-triangle-fill me-1"> </i>
            {commonError}
        </span>
    );
};

interface SignInButtonProps {
    isSignedIn: boolean;
    isSubmitting: boolean;
    isDisabled: boolean;
    onClick: () => any;
}

const SignInButton = ({ isSignedIn, isSubmitting, isDisabled, onClick }: SignInButtonProps) => {
    if (isSignedIn) {
        return null;
    }
    
    let content: React.ReactNode;
    if (!isSubmitting) {
        content = <span>Login</span>;
    } else {
        content = (
            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
        );
    }

    return (
        <button className="btn btn-primary w-100" disabled={isDisabled} onClick={onClick}>
            {content}
        </button>
    );
};

export default SignInView;