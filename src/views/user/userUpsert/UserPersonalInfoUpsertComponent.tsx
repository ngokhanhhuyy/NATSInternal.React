import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import { type UserPersonalInformationUpsertModel }
    from "@/models/user/userPersonalInformationUpsertModel";
import { Gender } from "@/services/dtos/enums";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { usePhotoUtility } from "@/utilities/photoUtility";
import { FileTooLargeError } from "@/errors";
import * as styles from "./UserPersonalInfoUpsertComponent.module.css";

// Layout component.
import SubBlock from "@/views/layouts/SubBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import SelectInput from "@/views/form/SelectInputComponent";
import DateInput from "@/views/form/DateInputComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";
import { FormContext } from "@/views/form/FormComponent";

// Utilities.
const photoUtility = usePhotoUtility();

// Styles.
const avatarPreviewBlurredStyle: string = styles["avatarPreviewBlurred"];
const avatarSpinnerVisibleStyle: string = styles["avatarSpinnerVisible"];

// Interface.
interface Props {
    model: UserPersonalInformationUpsertModel;
    onModelChanged: (changedData: Partial<UserPersonalInformationUpsertModel>) => any;
    borderTop?: boolean;
    roundedBottom?: boolean;
    isInitialRendering: boolean;
}

// Component.
const UserPersonalInoUpsert = (props: Props) => {
    // Dependencies.
    const alertModalStore = useAlertModalStore();
    const formContext = useContext(FormContext);

    // States.
    const modelState = formContext?.modelState;
    const [avatarPreviewSource, setAvatarPreviewSource] = useState<string>(() => {
        return props.model.avatarUrl ?? photoUtility.getDefaultPhotoUrl();
    });
    const [avatarFileUploaded, setAvatarFileUploaded] = useState<boolean>(false);
    const [avatarProcessing, setAvatarProcessing] = useState<boolean>(false);
    const avatarFileInputElement = useRef<HTMLInputElement>(null!);

    // Memo.
    const avatarDeleteButtonVisibility = useMemo<boolean>(() => {
        if (!props.model.avatarChanged) {
            return props.model.avatarUrl != null;
        }
        return avatarFileUploaded;
    }, [props.model.avatarChanged]);

    const avatarPreviewClassName = useMemo<string | undefined>(() => {
        const names: string[] = [];
        if (!modelState) {
            return;
        }

        if (modelState.isValidated) {
            if (modelState.hasError("avatarFile")) {
                names.push("bg-danger bg-opacity-10 border-danger");
            }
            names.push("bg-success bg-opacity-10 border-success");
        }
    
        if (avatarProcessing) {
            names.push(avatarPreviewBlurredStyle);
        }
        
        return names.join(" ");
    }, [modelState, modelState?.isValidated, modelState?.hasError("avatarFile")]);

    const avatarSpinnerClassName = useMemo<string | undefined>(() => {
        return avatarProcessing ? avatarSpinnerVisibleStyle : undefined;
    }, [avatarProcessing]);

    // Effect.
    useEffect(() => {
        if (!props.isInitialRendering) {
            props.onModelChanged({ avatarChanged: true });
        }
    }, [props.model.avatarFile]);
    
    // Callbacks.
    async function onAvatarFileInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length && files[0]) {
            setAvatarProcessing(true);
            try {
                const convertResult = await photoUtility.fileToBase64Strings(files[0]);
                const [convertedAvatarPreviewSource, convertedAvatarFile] = convertResult;
                setAvatarPreviewSource(convertedAvatarPreviewSource);
                props.onModelChanged({ avatarFile: convertedAvatarFile });
                setAvatarFileUploaded(true);
            } catch (error) {
                if (error instanceof FileTooLargeError) {
                    await alertModalStore.getFileTooLargeConfirmationAsync();
                } else {
                    throw error;
                }
            }
            setAvatarProcessing(false);
        } else {
            onAvatarDeleteButtonClicked();
        }
    }
    
    function onAvatarDeleteButtonClicked() {
        props.onModelChanged({ avatarFile: null });
        setAvatarFileUploaded(false);
        setAvatarPreviewSource(photoUtility.getDefaultPhotoUrl());
    }

    return (
        <SubBlock
            title="Thông tin cá nhân"
            bodyClassName="row g-0"
            borderTop={props.borderTop}
            roundedBottom={props.roundedBottom}
        >
            {/* Left column */}
            <div className="col col-md-auto col-sm-12 col-12 pt-4 pb-2 ps-2 pe-3 d-flex
                            flex-column justify-content-start align-items-center">
                <div className={styles["avatarPreviewContainer"]}>
                    {/* Avatar preview */}
                    <img className={`img-thumbnail ${styles["avatarPreview"]}
                                    ${avatarPreviewClassName}`}
                            src={avatarPreviewSource} />
                    
                    {/* Avatar edit button */}
                    <button
                        className={`btn btn-outline-primary btn-sm
                                    ${styles["avatarEditButton"]}`}
                        type="button"
                        onClick={() => avatarFileInputElement.current.click()}
                        disabled={avatarProcessing}
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>
    
                    {/* Avatar delete button */}
                    <button
                        className={"btn btn-outline-danger btn-sm " +
                                    styles["avatarDeleteButton"] + " " +
                                    (avatarDeleteButtonVisibility ? "" : "d-none")}
                        type="button"
                        onClick={onAvatarDeleteButtonClicked}
                    >
                        <i className="bi bi-trash3"></i>
                    </button>
    
                    {/* Avatar spinner */}
                    <div className={`${styles["avatarSpinner"]} ${avatarSpinnerClassName}`}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
    
                </div>
                <ValidationMessage name="personalInformation.avatarFile" />
                <input
                    type="file"
                    className="d-none"
                    accept="image/gif, image/jpeg, image/png"
                    ref={avatarFileInputElement}
                    onChange={onAvatarFileInputChanged}
                />
            </div>
    
            {/* Right column */}
            <div className="col">
                <div className="row g-3">
                    {/* FirstName */}
                    <div className="col col-md-4 col-sm-12 col-12">
                        <div className="form-group">
                            <Label text="Họ" required />
                            <TextInput
                                name="personalInformation.firstName"
                                placeholder="Nguyễn" maxLength={15}
                                value={props.model.firstName}
                                onValueChanged={firstName => {
                                    props.onModelChanged({ firstName });
                                }}
                            />
                            <ValidationMessage name="personalInformation.firstName" />
                        </div>
                    </div>
    
                    {/* MiddleName */}
                    <div className="col col-md-4 col-sm-12 col-12">
                        <div className="form-group">
                            <Label text="Tên đệm" />
                            <TextInput
                                name="personalInformation.middleName"
                                placeholder="Văn"
                                maxLength={20}
                                value={props.model.middleName}
                                onValueChanged={middleName => {
                                    props.onModelChanged({ middleName });
                                }}
                            />
                            <ValidationMessage name="personalInformation.middleName" />
                        </div>
                    </div>
    
                    {/* LastName */}
                    <div className="col col-md-4 col-sm-12 col-12">
                        <div className="form-group">
                            <Label text="Tên" required />
                            <TextInput
                                placeholder="An"
                                maxLength={15}
                                name="personalInformation.lastName"
                                value={props.model.lastName}
                                onValueChanged={lastName => {
                                    props.onModelChanged({ lastName });
                                }}
                            />
                            <ValidationMessage name="personalInformation.lastName" />
                        </div>
                    </div>
    
                    {/* Gender */}
                    <div className="col col-sm-6 col-12">
                        <div className="form-group">
                            <Label text="Giới tính" required />
                            <SelectInput
                                name="personalInformation.gender"
                                options={[
                                    { value: Gender[Gender.Male], displayName: "Nam" },
                                    { value: Gender[Gender.Female], displayName: "Nữ" },
                                ]}
                                value={Gender[props.model.gender]}
                                onValueChanged={(gender: keyof typeof Gender) => {
                                    props.onModelChanged({ gender: Gender[gender] });
                                }}
                            />
                            <ValidationMessage name="personalInformation.gender" />
                        </div>
                    </div>
                    
                    {/* Birthday */}
                    <div className="col col-sm-6 col-12">
                        <div className="form-group">
                            <Label text="Sinh nhật" />
                            <DateInput
                                name="personalInformation.birthday"
                                value={props.model.birthday}
                                onValueChanged={birthday => {
                                    props.onModelChanged({ birthday });
                                }}
                            />
                            <ValidationMessage name="personalInformation.birthday" />
                        </div>
                    </div>
                    
                    {/* PhoneNumber */}
                    <div className="col col-sm-6 col-12 mb-sm-0">
                        <div className="form-group">
                            <Label text="Số điện thoại" />
                            <TextInput
                                name="personalInformation.phoneNumber"
                                type="tel"
                                placeholder="0123 456 789"
                                maxLength={12}
                                value={props.model.phoneNumber}
                                onValueChanged={phoneNumber => {
                                    props.onModelChanged({ phoneNumber });
                                }}
                            />
                            <ValidationMessage name="personalInformation.phoneNumber" />
                        </div>
                    </div>
                    
                    {/* Email */}
                    <div className="col col-sm-6 col-12">
                        <div className="form-group">
                            <Label text="Email" />
                            <TextInput
                                type="email"
                                name="personalInformation.email"
                                placeholder="nguyenvanan@gmail.com"
                                maxLength={255}
                                value={props.model.email}
                                onValueChanged={email => {
                                    props.onModelChanged({ email });
                                }}
                            />
                            <ValidationMessage name="personalInformation.email" />
                        </div>
                    </div>
                </div>
            </div>
        </SubBlock>
    );
};

export default UserPersonalInoUpsert;