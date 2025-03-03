import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CustomerUpsertModel } from "@/models/customer/customerUpsertModel";
import { useCustomerService } from "@/services/customerService";
import { Gender } from "@/services/dtos/enums";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useRouteGenerator } from "@/router/routeGenerator";

// Layout components.
import UpsertViewContainer from "@layouts/UpsertViewContainerComponent";
import MainBlock from "@layouts/MainBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import TextAreaInput from "@/views/form/TextAreaInputComponent";
import DateInput from "@/views/form/DateInputComponent";
import SelectInput from "@/views/form/SelectInputComponent";
import DeleteButton from "@/views/form/DeleteButtonComponent";
import SubmitButton from "@/views/form/SubmitButtonComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Props.
interface CustomerCreateViewProps {
    isForCreating: true;
    id?: undefined;
}

interface CustomerUpdateViewProps {
    isForCreating: false,
    id: number;
}

// Component.
const CustomerUpsertView = (props: CustomerCreateViewProps | CustomerUpdateViewProps) => {
    // Dependencies.
    const navigate = useNavigate();
    const customerService = useCustomerService();
    const routeGenerator = useRouteGenerator();
    
    // Model and states.
    const initializedModel = useAsyncModelInitializer({
        initializer: async () => {
            if (props.isForCreating) {
                await new Promise(resolve => setTimeout(resolve, 300));
                return new CustomerUpsertModel();
            }

            const responseDto = await customerService.getDetailAsync(props.id);
            return new CustomerUpsertModel(responseDto);
        },
        cacheKey: props.isForCreating ? "customerCreate" : "customerUpdate"
    });
    const { modelState } = useUpsertViewStates();
    const [model, setModel] = useState(() => initializedModel);
    const isModelDirty = useDirtyModelChecker(initializedModel, model);
    
    // Computed.
    const blockTitle = useMemo<string>(() => {
        if (props.isForCreating) {
            return "TẠO KHÁCH HÀNG";
        }

        return "CHỈNH SỬA KHÁCH HÀNG";
    }, []);

    const genderOptions = useMemo(() => [
        { value: Gender[Gender.Male], displayName: "Nam" },
        { value: Gender[Gender.Female], displayName: "Nữ" }
    ], []);

    // Functions.
    const handleSubmissionAsync =  async (): Promise<number> => {
        if (props.isForCreating) {
            return await customerService.createAsync(model.toRequestDto());
        }
        
        await customerService.updateAsync(model.id, model.toRequestDto());
        return model.id;
    };

    const handleSucceededSubmissionAsync = async (submittedId: number): Promise<void> => {
        await navigate(routeGenerator.getCustomerDetailRoutePath(submittedId));
    };

    const handleDeletionAsync = useCallback(async (): Promise<void> => {
        await customerService.deleteAsync(model.id);
    }, [model.id]);

    const handleSucceededDeletionAsync = useCallback(async (): Promise<void> => {
        await navigate(routeGenerator.getCustomerListRoutePath());
    }, []);

    return (
        <UpsertViewContainer
            modelState={modelState}
            submittingAction={handleSubmissionAsync}
            onSubmissionSucceeded={handleSucceededSubmissionAsync}
            deletingAction={handleDeletionAsync}
            onDeletionSucceeded={handleSucceededDeletionAsync}
            isModelDirty={isModelDirty}
        >
            <div className="row g-3 justify-content-end">
                <div className="col col-12">
                    <MainBlock
                        title={blockTitle}
                        closeButton
                        bodyClassName="row g-3"
                        bodyPadding={[0, 2, 2, 2]}
                    >
                        {/* FirstName */}
                        <div className="col col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Họ" required />
                                <TextInput
                                    name="firstName"
                                    placeholder="Nguyễn"
                                    maxLength={10}
                                    value={model.firstName}
                                    onValueChanged={firstName => {
                                        setModel(model => model.from({ firstName }));
                                    }}
                                />
                                <ValidationMessage name="firstName" />
                            </div>
                        </div>

                        {/* MiddleName */}
                        <div className="col col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Tên đệm" />
                                <TextInput
                                    name="middleName"
                                    placeholder="Văn"
                                    maxLength={20}
                                    value={model.middleName}
                                    onValueChanged={(middleName) => {
                                        setModel(model => model.from({ middleName }));
                                    }}
                                />
                                <ValidationMessage name="middleName" />
                            </div>
                        </div>

                        {/* LastName */}
                        <div className="col col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Tên" required />
                                <TextInput
                                    name="lastName"
                                    placeholder="An"
                                    maxLength={10}
                                    value={model.lastName}
                                    onValueChanged={lastName => {
                                        setModel(model => model.from({ lastName }));
                                    }}
                                />
                                <ValidationMessage name="lastName" />
                            </div>
                        </div>

                        {/* NickName */}
                        <div className="col col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Biệt danh" />
                                <TextInput
                                    name="nickName"
                                    placeholder="Biệt danh"
                                    maxLength={35}
                                    value={model.nickName}
                                    onValueChanged={nickName => {
                                        setModel(model => model.from({ nickName }));
                                    }}
                                />
                                <ValidationMessage name="nickName" />
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="col col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Giới tính" />
                                <SelectInput
                                    name="gender"
                                    options={genderOptions}
                                    value={Gender[model.gender]}
                                    onValueChanged={(gender: keyof typeof Gender) => {
                                        setModel(model => model.from({
                                            gender: Gender[gender]
                                        }));
                                    }}
                                />
                                <ValidationMessage name="gender" />
                            </div>
                        </div>

                        {/* Birthday */}
                        <div className="col col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Ngày sinh" />
                                <DateInput
                                    name="birthday"
                                    value={model.birthday}
                                    onValueChanged={birthday => {
                                        setModel(model => model.from({ birthday }));
                                    }}
                                />
                                <ValidationMessage name="birthday" />
                            </div>
                        </div>

                        {/* PhoneNumber */}
                        <div className="col col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-input">
                                <Label text="Số điện thoại" />
                                <TextInput
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="0123 456 789"
                                    value={model.phoneNumber}
                                    onValueChanged={phoneNumber => {
                                        setModel(model => model.from({ phoneNumber }));
                                    }}
                                    maxLength={15}
                                />
                                <ValidationMessage name="phoneNumber" />
                            </div>
                        </div>

                        {/* ZaloNumber */}
                        <div className="col col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <div className="form-input">
                                <Label text="Zalo" />
                                <TextInput
                                    name="zaloNumber"
                                    type="tel"
                                    placeholder="0123 456 789"
                                    value={model.zaloNumber}
                                    onValueChanged={zaloNumber => {
                                        setModel(model => model.from({ zaloNumber }));
                                    }}
                                    maxLength={15}
                                />
                                <ValidationMessage name="zaloNumber" />
                            </div>
                        </div>

                        {/* FacebookUrl */}
                        <div className="col col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Facebook" />
                                <TextInput name="facebookUrl" regex="a-zA-Z0-9-.://_@"
                                    placeholder="https://facebook.com/nguyen.van.a"
                                    value={model.facebookUrl}
                                    onValueChanged={facebookUrl => {
                                        setModel(model => model.from({ facebookUrl }));
                                    }}
                                />
                                <ValidationMessage name="facebookUrl" />
                            </div>
                        </div>

                        {/* Email  */}
                        <div className="col col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Email" />
                                <TextInput
                                    name="email"
                                    type="email"
                                    maxLength={255}
                                    placeholder="nguyenvana@gmail.com"
                                    value={model.email}
                                    onValueChanged={email => {
                                        setModel(model => model.from({ email }));
                                    }}
                                />
                                <ValidationMessage name="email" />
                            </div>
                        </div>

                        {/* Address  */}
                        <div className="col col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Địa chỉ" />
                                <TextInput
                                    name="address"
                                    maxLength={255}
                                    placeholder="123 Nguyễn Tất Thành"
                                    value={model.address}
                                    onValueChanged={address => {
                                        setModel(model => model.from({ address }));
                                    }}
                                />
                                <ValidationMessage name="address" />
                            </div>
                        </div>

                        {/* Note  */}
                        <div className="col col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="form-input">
                                <Label text="Ghi chú" />
                                <TextAreaInput
                                    name="note"
                                    maxLength={255}
                                    style={{ minHeight: "150px" }}
                                    placeholder="Ghi chú" value={model.note}
                                    onValueChanged={note => {
                                        setModel(model => model.from({ note }));
                                    }}
                                />
                                <ValidationMessage name="note" />
                            </div>
                        </div>
                    </MainBlock>
                </div>
            </div>
            <div className="row g-3 justify-content-end">
                {/* Delete button */}
                {model.canDelete && (
                    <div className="col col-auto">
                        <DeleteButton />
                    </div>
                )}

                {/* Submit button */}
                <div className="col col-auto">
                    <SubmitButton />
                </div>
            </div>
        </UpsertViewContainer>
    );
};

export default CustomerUpsertView;