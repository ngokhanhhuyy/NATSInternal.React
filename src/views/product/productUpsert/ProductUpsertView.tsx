import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductService } from "@/services/productService";
import { useProductCategoryService } from "@/services/productCategoryService";
import { useBrandService } from "@/services/brandService";
import { ProductUpsertModel } from "@/models/product/productUpsertModel";
import { useUpsertViewStates } from "@/hooks/upsertViewStatesHook";
import { useDirtyModelChecker } from "@/hooks/dirtyModelCheckerHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { NotFoundError } from "@/errors";

// Layout components.
import UpsertViewContainer from "@/views/layouts/UpsertViewContainerComponent";
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form components.
import SubmitButton from "@/views/form/SubmitButtonComponent";
import DeleteButton from "@/views/form/DeleteButtonComponent";

// Child component
import Inputs from "./InputsComponent";

// Component.
const ProductUpsertView = ({ id }: { id?: number; }) => {
    // Dependencies.
    const navigate = useNavigate();
    const productService = useProductService();
    const productCategoryService = useProductCategoryService();
    const brandService = useBrandService();
    const routeGenerator = useRouteGenerator();
    const alertModalStore = useAlertModalStore();

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished, modelState } = useUpsertViewStates();
    const [model, setModel] = useState(() => new ProductUpsertModel());
    const { isModelDirty, setOriginalModel } = useDirtyModelChecker(model);

    // Effect.
    useEffect(() => {
        const initialLoadAsync = async () => {
            if (id == null) {
                const [canCreate, brandOptions, categoryOptions] = await Promise.all([
                    productService.getCreatingPermissionAsync(),
                    brandService.getAllAsync(),
                    productCategoryService.getAllAsync()
                ]);

                if (!canCreate) {
                    await alertModalStore.getUnauthorizationConfirmationAsync();
                    await navigate(-1);
                    return;
                }

                setModel(model => {
                    const loadedModel = model.fromResponseDtos(brandOptions, categoryOptions);
                    setOriginalModel(model);
                    return loadedModel;
                });
            } else {
                try {
                    const [brandOptions, categoryOptions, detail] = await Promise.all([
                        brandService.getAllAsync(),
                        productCategoryService.getAllAsync(),
                        productService.getDetailAsync(id)
                    ]);
    
                    if (!detail.authorization.canEdit) {
                        await alertModalStore.getUnauthorizationConfirmationAsync();
                        await navigate(-1);
                        return;
                    }

                    setModel(model => {
                        const loadedModel = model.fromResponseDtos(
                            brandOptions,
                            categoryOptions,
                            detail);
                        setOriginalModel(model);
                        return loadedModel;
                    });
                } catch (error) {
                    if (error instanceof NotFoundError) {
                        await alertModalStore.getNotFoundConfirmationAsync();
                        await navigate(-1);
                        return;
                    }
                    
                    throw error;
                }
            }
        };

        initialLoadAsync().finally(onInitialLoadingFinished);
    }, []);

    // Computed.
    const isForCreating = useMemo(() => id == null, [id]);
    const blockTitle = useMemo<string>(() => {
        if (isForCreating) {
            return "Tạo sản phẩm mới";
        }
        return "Chỉnh sửa sản phẩm";
    }, []);

    // Functions.
    const handleSubmissionAsync = async (): Promise<number> => {
        if (isForCreating) {
            const id = await productService.createAsync(model.toRequestDto());
            setModel(model => model.from({ id }));
            return id;
        } else {
            await productService.updateAsync(model.id, model.toRequestDto());
            return model.id;
        }
    };

    const handleDeletionAsync = async (): Promise<void> => {
        await productService.deleteAsync(model.id);
    };
    
    const handleSucceededSubmissionAsync = async (submissionResult: number): Promise<void> => {
        await navigate(routeGenerator.getProductDetailRoutePath(submissionResult));
    };

    const handleSucceededDeletionAsync = useCallback(async (): Promise<void> => {
        await navigate(routeGenerator.getProductListRoutePath());
    }, []);
    
    const onThumbnailFileChanged = (file: string | null): void => {
        setModel(model => model.from({ thumbnailFile: file, thumbnailChanged: true }));
    };

    return (
        <UpsertViewContainer
            modelState={modelState}
            isInitialLoading={isInitialLoading}
            submittingAction={handleSubmissionAsync}
            deletingAction={handleDeletionAsync}
            onSubmissionSucceeded={handleSucceededSubmissionAsync}
            onDeletionSucceeded={handleSucceededDeletionAsync}
            isModelDirty={isModelDirty}
        >
            <div className="row g-3">
                <div className="col col-12">
                    <MainBlock title={blockTitle} bodyPadding={2} closeButton>
                        {/* Upper row */}
                        <Inputs model={model} setModel={setModel}
                            isInitialLoading={isInitialLoading}
                            onThumbnailFileChanged={onThumbnailFileChanged}/>
                    </MainBlock>
                </div>
            </div>

            <div className="row g-3 justify-content-end">
                {/* Delete button */}
                {!isForCreating && model.canDelete && (
                    <div className="col col-auto">
                        <DeleteButton/>
                    </div>
                )}

                {/* Submit button */}
                <div className="col col-auto">
                    <SubmitButton/>
                </div>
            </div>
        </UpsertViewContainer>
    );
};

export default ProductUpsertView;