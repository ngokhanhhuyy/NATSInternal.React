import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBrandService } from "@/services/brandService";
import { BrandUpsertModel } from "@/models/product/brand/brandUpsertModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useRouteGenerator } from "@/router/routeGenerator";
import { NotFoundError } from "@/errors";

// Layout components.
import UpsertViewContainer from "@layouts/UpsertViewContainerComponent";
import MainBlock from "@layouts/MainBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import ImageInput from "@/views/form/ImageInputComponent";
import SubmitButton from "@/views/form/SubmitButtonComponent";
import DeleteButton from "@/views/form/DeleteButtonComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Component.
const BrandUpsertView = ({ id }: { id?: number }) => {
    // Dependencies.
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();
    const service = useBrandService();
    const routeGenerator = useRouteGenerator();

    // Model.
    const { isInitialLoading, onInitialLoadingFinished, modelState } = useUpsertViewStates();
    const [model, setModel] = useState<BrandUpsertModel>(() => new BrandUpsertModel());
    const { isModelDirty, setOriginalModel } = useDirtyModelChecker(model);
    
    // Effect.
    useEffect(() => {
        const initialLoadAsync = async () => {
            try {
                if (id == null) {
                    const canCreate = await service.getCreatingPermissionAsync();
                    if (!canCreate) {
                        await alertModalStore.getUnauthorizationConfirmationAsync();
                        await navigate(routeGenerator.getProductListRoutePath());
                    }

                    setOriginalModel(model);
                } else {
                    const responseDto = await service.getDetailAsync(id);
                    if (!responseDto.authorization.canEdit) {
                        await alertModalStore.getUnauthorizationConfirmationAsync();
                        return;
                    }

                    setModel(model => {
                        const loadedModel = model.fromResponseDto(responseDto);
                        setOriginalModel(loadedModel);
                        return loadedModel;
                    });
                }
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    await navigate(routeGenerator.getProductListRoutePath());
                    return;
                }

                throw error;
            }
        };

        initialLoadAsync().finally(onInitialLoadingFinished);
    }, []);

    // Computed.
    const isForCreating = useMemo(() => id == null, [id]);

    // Callback.
    const handleSubmissionAsync = async (): Promise<number> => {
        if (isForCreating) {
            return await service.createAsync(model.toRequestDto());
        } else {
            await service.updateAsync(model.id, model.toRequestDto());
            return model.id;
        }
    };

    const handleDeletionAsync = async (): Promise<void> => {
        await service.deleteAsync(model.id);
    };

    const handleSucceededAsync = useCallback(async (): Promise<void> => {
        await navigate(routeGenerator.getProductListRoutePath());
    }, []);

    return (
        <UpsertViewContainer
            modelState={modelState}
            isInitialLoading={isInitialLoading}
            submittingAction={handleSubmissionAsync}
            onSubmissionSucceeded={handleSucceededAsync}
            deletingAction={handleDeletionAsync}
            onDeletionSucceeded={handleSucceededAsync}
            isModelDirty={isModelDirty}
        >
            <div className="row g-3 justify-content-end">
                <div className="col col-12">
                    <InputBlock
                        model={model}
                        setModel={setModel}
                        isForCreating={id == null}
                    />
                </div>

                {!isForCreating && model.canDelete && (
                    <div className="col col-auto">
                        {/* Submit button */}
                        <DeleteButton />
                    </div>
                )}

                <div className="col col-auto">
                    {/* Submit button */}
                    <SubmitButton />
                </div>
            </div>
        </UpsertViewContainer>
    );
};


interface InputBlockProps {
    model: BrandUpsertModel;
    setModel: React.Dispatch<React.SetStateAction<BrandUpsertModel>>;
    isForCreating: boolean;
}

const InputBlock = ({ isForCreating, model, setModel }: InputBlockProps) => {
    // Memo.
    const blockTitle = useMemo<string>(() => {
        if (isForCreating) {
            return "Tạo thương hiệu mới";
        }

        return "Chỉnh sửa thương hiệu";
    }, [isForCreating]);

    // Callback.
    const onThumbnailFileChanged = (file: string | null) => {
        setModel(model => model.from({
            thumbnailFile: file,
            thumbnailChanged: true
        }));
    };

    return (
        <MainBlock
            title={blockTitle}
            closeButton
            bodyPadding={2}
            bodyClassName="row-g-3"
        >
            <div className="col col-md-auto col-sm-12 col-12 py-3 d-flex
                            flex-column align-items-center justify-content-start">
                <ImageInput
                    name="thumbnailFile"
                    defaultSrc="/images/default.jpg"
                    url={model.thumbnailUrl}
                    onValueChanged={onThumbnailFileChanged}
                />
                <ValidationMessage name="thumbnailFile" />
            </div>
            <div className="col">
                <div className="row g-3">
                    {/* Brand name */}
                    <div className="col col-12">
                        <Label text="Tên thương hiệu" required />
                        <TextInput name="name" placeholder="Tên thương hiệu" maxLength={20}
                                value={model.name}
                                onValueChanged={name => setModel(m => m.from({ name }))} />
                        <ValidationMessage name="name" />
                    </div>

                    {/* Website */}
                    <div className="col col-xxl-4 col-xl-6 col-lg-6
                                    col-md-12 col-sm-12 col-12"
                    >
                        <Label text="Website" />
                        <TextInput
                            name="website"
                            maxLength={255}
                            placeholder="abc.com"
                            value={model.website}
                            onValueChanged={website => setModel(m => m.from({ website }))}
                        />
                        <ValidationMessage name="website" />
                    </div>

                    {/* SocialMediaUrl */}
                    <div className="col col-xxl-4 col-xl-6 col-lg-6 col-md-12 col-sm-12
                                col-12">
                        <Label text="Mạng xã hội" />
                        <TextInput
                            name="socialMediaUrl"
                            maxLength={255}
                            placeholder="facebook.com/abc"
                            value={model.socialMediaUrl}
                            onValueChanged={socialMediaUrl => {
                                setModel(m => m.from({ socialMediaUrl }));
                            }}
                        />
                        <ValidationMessage name="socialMediaUrl" />
                    </div>

                    {/* PhoneNumber */}
                    <div className="col col-xxl-4 col-xl-6 col-lg-6 col-md-12 col-sm-12
                                col-12">
                        <Label text="Số điện thoại" />
                        <TextInput
                            type="tel"
                            name="phoneNumber"
                            maxLength={15}
                            placeholder="0123 456 789"
                            value={model.phoneNumber}
                            onValueChanged={phoneNumber => {
                                setModel(m => m.from({ phoneNumber }));
                            }}
                        />
                        <ValidationMessage name="phoneNumber" />
                    </div>

                    {/* Email */}
                    <div className="col col-xxl-4 col-xl-6 col-lg-6
                                    col-md-12 col-sm-12 col-12"
                    >
                        <Label text="Email" />
                        <TextInput
                            type="email"
                            name="email"
                            maxLength={255}
                            placeholder="abc@gmail.com"
                            value={model.email}
                            onValueChanged={email => setModel(m => m.from({ email }))}
                        />
                        <ValidationMessage name="email" />
                    </div>

                    {/* Address */}
                    <div className="col col-xxl-8 col-xl-12 col-lg-12
                                    col-md-12 col-sm-12 col-12"
                    >
                        <Label text="Địa chỉ" />
                        <TextInput
                            name="address"
                            maxLength={255}
                            placeholder="123 Nguyễn Tất Thành"
                            value={model.address}
                            onValueChanged={address => setModel(m => m.from({ address }))}
                        />
                        <ValidationMessage name="address" />
                    </div>
                </div>
            </div>
        </MainBlock>
    );
};

export default BrandUpsertView;