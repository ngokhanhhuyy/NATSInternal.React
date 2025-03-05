import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProductCategoryService } from "@/services/productCategoryService";
import { ProductCategoryUpsertModel }
    from "@/models/product/productCategory/productCategoryUpsertModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useRouteGenerator } from "@/router/routeGenerator";
import { AuthorizationError } from "@/errors";

// Layout components.
import UpsertViewContainer from "@layouts/UpsertViewContainerComponent";
import MainBlock from "@layouts/MainBlockComponent";

// Form components.
import Label from "@/views/form/LabelComponent";
import TextInput from "@/views/form/TextInputComponent";
import SubmitButton from "@/views/form/SubmitButtonComponent";
import DeleteButton from "@/views/form/DeleteButtonComponent";
import ValidationMessage from "@/views/form/ValidationMessageComponent";

// Component.
const ProductCategoryUpsertView = ({ id }: { id?: number }) => {
    // Dependencies.
    const navigate = useNavigate();
    const service = useProductCategoryService();
    const routeGenerator = useRouteGenerator();

    // Model and states.
    const { modelState } = useUpsertViewStates();
    const initialModel = useAsyncModelInitializer({
        initializer: async () => {
            if (id == null) {
                const canCreate = await service.getCreatingPermissionAsync();
                if (!canCreate) {
                    throw new AuthorizationError();
                }

                return new ProductCategoryUpsertModel();
            } else {
                const responseDto = await service.getDetailAsync(id);
                if (!responseDto.authorization.canEdit) {
                    throw new AuthorizationError();
                }

                return new ProductCategoryUpsertModel(responseDto);
            }
        },
        cacheKey: id == null ? "productCategoryCreate" : "productCategoryUpdate"
    });
    const [model, setModel] = useState(() => initialModel);
    const isModelDirty = useDirtyModelChecker(initialModel, model);

    // Computed.
    const isForCreating = useMemo<boolean>(() => id == null, [id]);

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
                        isForCreating={isForCreating}
                    />
                </div>

                {!isForCreating && model.canDelete && (
                    <div className="col col-auto">
                        {/* Submit button */}
                        <DeleteButton/>
                    </div>
                )}

                <div className="col col-auto">
                    {/* Submit button */}
                    <SubmitButton/>
                </div>
            </div>
        </UpsertViewContainer>
    );
};

interface InputBlockProps {
    model: ProductCategoryUpsertModel;
    setModel: React.Dispatch<React.SetStateAction<ProductCategoryUpsertModel>>;
    isForCreating: boolean;
}

const InputBlock = ({ isForCreating, model, setModel }: InputBlockProps) => {
    // Memo.
    const blockTitle = useMemo<string>(() => {
        if (isForCreating) {
            return "Tạo phân loại sản phẩm mới";
        }

        return "Chỉnh sửa phân loại sản phẩm";
    }, [isForCreating]);

    return (
        <MainBlock
            title={blockTitle}
            closeButton
            bodyClassName="row g-3"
            bodyPadding={[0, 2, 2, 2]}
        >
            <div className="col col-12">
                <Label text="Tên phân loại" />
                <TextInput
                    name="name"
                    maxLength={30}
                    placeholder="Tên phân loại"
                    value={model.name}
                    onValueChanged={name => setModel(m => m.from({ name }))}
                />
                <ValidationMessage name="name" />
            </div>
        </MainBlock>
    );
};

export default ProductCategoryUpsertView;