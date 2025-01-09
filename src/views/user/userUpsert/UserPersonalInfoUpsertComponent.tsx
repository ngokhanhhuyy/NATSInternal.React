import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import type { UserPersonalInformationUpsertModel }
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
    setModel: React.Dispatch<React.SetStateAction<UserPersonalInformationUpsertModel>>;
    borderTop?: boolean;
    roundedBottom?: boolean;
}

// Component.
const UserPersonalInoUpsert = ({ model, setModel, borderTop, roundedBottom }: Props) => {
    const alertModalStore = useAlertModalStore();
    const formContext = useContext(FormContext);
    const modelState = formContext?.modelState;
    const [
        avatarPreviewSource,
        setAvatarPreviewSource
    ] = useState<string>(model.avatarUrl ?? photoUtility.getDefaultPhotoUrl());
    const [avatarFileUploaded, setAvatarFileUploaded] = useState<boolean>(false);
    const [avatarProcessing, setAvatarProcessing] = useState<boolean>(false);
    const [isInitialLoading, setInitialLoading] = useState<boolean>(true);
    const avatarFileInputElement = useRef<HTMLInputElement>(null!);

    // Memo.
    const avatarDeleteButtonVisibility = useMemo<boolean>(() => {
        if (!model.avatarChanged) {
            return model.avatarUrl != null;
        }
        return avatarFileUploaded;
    }, [model.avatarChanged]);

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
        if (isInitialLoading) {
            setInitialLoading(false);
            return;
        }

        setModel(model => model.from({ avatarChanged: true }));
    }, [model.avatarFile]);
    
    // Functions.
    async function onAvatarFileInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
        const files = (event.target as HTMLInputElement).files;
        if (files && files.length && files[0]) {
            setAvatarProcessing(true);
            try {
                const convertResult = await photoUtility.fileToBase64Strings(files[0]);
                const [convertedAvatarPreviewSource, convertedAvatarFile] = convertResult;
                setAvatarPreviewSource(convertedAvatarPreviewSource);
                setModel(model => model.from({ avatarFile: convertedAvatarFile }));
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
        setModel(model => model.from({ avatarFile: null }));
        setAvatarFileUploaded(false);
        setAvatarPreviewSource(photoUtility.getDefaultPhotoUrl());
    }

    return (
        <SubBlock title="Thông tin cá nhân" bodyClassName="row g-0" borderTop={borderTop}
                roundedBottom={roundedBottom}>
            {/* Left column */}
            <div className="col col-md-auto col-sm-12 col-12 pt-4 pb-2 ps-2 pe-3 d-flex
                            flex-column justify-content-start align-items-center">
                <div className={styles["avatarPreviewContainer"]}>
                    {/* Avatar preview */}
                    <img className={`img-thumbnail ${styles["avatarPreview"]}
                                    ${avatarPreviewClassName}`}
                            src={avatarPreviewSource} />
                    
                    {/* Avatar edit button */}
                    <button className={`btn btn-outline-primary btn-sm
                                        ${styles["avatarEditButton"]}`}
                            type="button"
                            onClick={() => avatarFileInputElement.current.click()}
                            disabled={avatarProcessing}>
                        <i className="bi bi-pencil-square"></i>
                    </button>
    
                    {/* Avatar delete button */}
                    <button className={`btn btn-outline-danger btn-sm
                                        ${styles["avatarDeleteButton"]}
                                        ${avatarDeleteButtonVisibility ? "" : "d-none"}`}
                            type="button"
                            onClick={onAvatarDeleteButtonClicked}>
                        <i className="bi bi-trash3"></i>
                    </button>
    
                    {/* Avatar spinner */}
                    <div className={`${styles["avatarSpinner"]} ${avatarSpinnerClassName}`}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
    
                </div>
                {/* <button className="btn w-100 avatar-add-button" v-if="false">
                    <i className="bi bi-person-bounding-box me-1"></i>
                    Thêm ảnh đại diện
                </button> */}
                <ValidationMessage name="personalInformation.avatarFile" />
                <input type="file" className="d-none"
                        accept="image/gif, image/jpeg, image/png"
                        ref={avatarFileInputElement}
                        onChange={onAvatarFileInputChanged} />
            </div>
    
            {/* Right column */}
            <div className="col">
                <div className="row g-3">
                    {/* FirstName */}
                    <div className="col col-md-4 col-sm-12 col-12">
                        <div className="form-group">
                            <Label text="Họ" required />
                            <TextInput name="personalInformation.firstName"
                                    placeholder="Nguyễn" maxLength={15}
                                    value={model.firstName}
                                    onValueChanged={firstName => {
                                        setModel(model => model.from({ firstName }));
                                    }} />
                            <ValidationMessage name="personalInformation.firstName" />
                        </div>
                    </div>
    
                    {/* MiddleName */}
                    <div className="col col-md-4 col-sm-12 col-12">
                        <div className="form-group">
                            <Label text="Tên đệm" />
                            <TextInput name="personalInformation.middleName"
                                    placeholder="Văn" maxLength={20}
                                    value={model.middleName}
                                    onValueChanged={middleName => {
                                        setModel(model => model.from({ middleName }));
                                    }} />
                            <ValidationMessage
                                    name="personalInformation.middleName" />
                        </div>
                    </div>
    
                    {/* LastName */}
                    <div className="col col-md-4 col-sm-12 col-12">
                        <div className="form-group">
                            <Label text="Tên" required />
                            <TextInput placeholder="An" maxLength={15}
                                    name="personalInformation.lastName"
                                    value={model.lastName}
                                    onValueChanged={lastName => {
                                        setModel(model => model.from({ lastName }));
                                    }} />
                            <ValidationMessage name="personalInformation.lastName" />
                        </div>
                    </div>
    
                    {/* Gender */}
                    <div className="col col-sm-6 col-12">
                        <div className="form-group">
                            <Label text="Giới tính" required />
                            <SelectInput name="personalInformation.gender"
                                    options={[
                                        { value: Gender[Gender.Male], displayName: "Nam" },
                                        { value: Gender[Gender.Female], displayName: "Nữ" },
                                    ]}
                                    value={Gender[model.gender]}
                                    onValueChanged={(gender: keyof typeof Gender) => {
                                        setModel(model => model.from({
                                            gender: Gender[gender]
                                        }));
                                    }}>
                            </SelectInput>
                            <ValidationMessage name="personalInformation.gender" />
                        </div>
                    </div>
                    
                    {/* Birthday */}
                    <div className="col col-sm-6 col-12">
                        <div className="form-group">
                            <Label text="Sinh nhật" />
                            <DateInput name="personalInformation.birthday"
                                    value={model.birthday}
                                    onValueChanged={birthday => {
                                        setModel(model => model.from({ birthday }));
                                    }} />
                            <ValidationMessage name="personalInformation.birthday" />
                        </div>
                    </div>
                    
                    {/* PhoneNumber */}
                    <div className="col col-sm-6 col-12 mb-sm-0">
                        <div className="form-group">
                            <Label text="Số điện thoại" />
                            <TextInput name="personalInformation.phoneNumber"
                                    type="tel" placeholder="0123 456 789" maxLength={12}
                                    value={model.phoneNumber}
                                    onValueChanged={phoneNumber => {
                                        setModel(model => model.from({ phoneNumber }));
                                    }} />
                            <ValidationMessage name="personalInformation.phoneNumber" />
                        </div>
                    </div>
                    
                    {/* Email */}
                    <div className="col col-sm-6 col-12">
                        <div className="form-group">
                            <Label text="Email" />
                            <TextInput type="email"
                                    name="personalInformation.email"
                                    placeholder="nguyenvanan@gmail.com" maxLength={255}
                                    value={model.email}
                                    onValueChanged={email => {
                                        setModel(model => model.from({ email }));
                                    }} />
                            <ValidationMessage name="personalInformation.email" />
                        </div>
                    </div>
                </div>
            </div>
        </SubBlock>
    );
};

export default UserPersonalInoUpsert;