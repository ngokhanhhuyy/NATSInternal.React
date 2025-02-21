import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProductService } from "@/services/productService";
import { ProductDetailModel } from "@/models/product/productDetailModel";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useAmountUtility } from "@/utilities/amountUtility";
import { useRouteGenerator } from "@/router/routeGenerator";
import { OperationError, NotFoundError } from "@/errors";

// Layout components.
import MainBlock from "@layouts/MainBlockComponent";

// Props.
interface Props {
    id: number;
    onInitialLoadingFinished: () => void;
}

// Component.
const ProductDetail = ({ id, onInitialLoadingFinished }: Props) => {
    // Dependencies.
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();
    const service = useProductService();
    const amountUtility = useMemo(useAmountUtility, []);
    const routeGenerator = useRouteGenerator();

    // Model and state.
    const [model, setModel] = useState<ProductDetailModel>();
    const [isDeleting, setDeleting] = useState<boolean>(false);
    const labelColumnClassName = useMemo(() => {
        return "col col-md-12 col-sm-4 col-12 fw-bold";
    }, []);
    const fieldColumnClassName = useMemo(() => {
        return "col col-md-12 col-sm-8 col-12 text-primary";
    }, []);
    
    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                const responseDto = await service.getDetailAsync(id);
                setModel(new ProductDetailModel(responseDto));
                onInitialLoadingFinished();
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    await navigate(routeGenerator.getProductListRoutePath());
                    return;
                }

                throw error;
            }
        };

        loadAsync();
    }, []);

    // Functions.
    const deleteAsync = useCallback(async (): Promise<void> => {
        if (!model) {
            return;
        }

        const shouldDelete = await alertModalStore.getDeletingConfirmationAsync();
        if (!shouldDelete) {
            return;
        }

        setDeleting(true);
        
        try {
            await service.deleteAsync(model.id);
            await alertModalStore.getSubmissionSuccessConfirmationAsync();
            await navigate(routeGenerator.getProductListRoutePath());
        } catch (error) {
            if (error instanceof OperationError) {
                await alertModalStore.getSubmissionErrorConfirmationAsync(error.errors);
                return;
            }

            throw error;
        } finally {
            setDeleting(false);
        }
    }, [model]);

    if (!model) {
        return null;
    }

    return (
        <MainBlock title="Chi tiết sản phẩm" closeButton>
            {/* Thumbnail */}
            <div className="row justify-content-center">
                <div className="col col-md-12 col-sm-8 col-10 p-3">
                    <img src={model.thumbnailUrl} className="img-thumbnail" />
                </div>
            </div>

            {/* Name */}
            <div className="fw-bold fs-5 d-flex justify-content-center text-center">
                {model.name}
            </div>

            {/* Action buttons */}
            <div className="actions-buttons d-flex justify-content-center
                            align-items-center">
                {/* Edit button */}
                {model.authorization.canEdit && (
                    <Link className="btn btn-outline-primary btn-sm me-2"
                            to={model.updateRoute}>
                        <i className="bi bi-pencil-square"></i>
                        <span className="ms-1">Chỉnh sửa</span>
                    </Link>
                )}

                {/* Delete button */}
                {model.authorization.canDelete && (
                    <DeleteButton isDeleting={isDeleting} onClick={deleteAsync} />
                )}
            </div>

            {/* Product detail */}
            {/* Unit */}
            <div className="row mt-3">
                <div className={labelColumnClassName}>
                    Đơn vị
                </div>
                <div className={fieldColumnClassName}>
                    <span>{model.unit}</span>
                </div>
            </div>

            {/* Price */}
            <div className="row mt-3">
                <div className={labelColumnClassName}>
                    Giá niêm yết
                </div>
                <div className={fieldColumnClassName}>
                    <span>
                        {amountUtility.getDisplayText(model.defaultPrice)}
                    </span>
                </div>
            </div>

            {/* VatFactor */}
            <div className="row mt-3">
                <div className={labelColumnClassName}>
                    Thuế VAT
                </div>
                <div className={fieldColumnClassName}>
                    <span>
                        {model.defaultVatPercentage}%
                    </span>
                </div>
            </div>

            {/* StockingQuantity */}
            <div className="row mt-3">
                <div className={labelColumnClassName}>
                    Số lượng trong kho
                </div>
                <div className={fieldColumnClassName}>
                    <span>
                        {model.stockingQuantity} {model.unit}
                    </span>
                </div>
            </div>

            {/* CreatedDateTime */}
            <div className="row mt-3">
                <div className={labelColumnClassName}>
                    Được tạo lúc
                </div>
                <div className={fieldColumnClassName}>
                    <span>{model.createdDateTime.dateTime}</span>
                </div>
            </div>

            {/* UpdatedDateTime */}
            {model.updatedDateTime && (
                <div className="row mt-3">
                    <div className={labelColumnClassName}>
                        Được chỉnh sửa lúc
                    </div>
                    <div className={fieldColumnClassName}>
                        <span>{model.updatedDateTime.dateTime}</span>
                    </div>
                </div>
            )}

            {/* Brand */}
            {model.brand && (
                <div className="row mt-3">
                    <div className={labelColumnClassName}>
                        Thương hiệu
                    </div>
                    <div className={fieldColumnClassName}>
                        <span>{model.brand.name}</span>
                    </div>
                </div>
            )}

            {/* Category */}
            {model.category && (
                <div className="row mt-3">
                    <div className={labelColumnClassName}>
                        Phân loại
                    </div>
                    <div className={fieldColumnClassName}>
                        <span>{model.category.name}</span>
                    </div>
                </div>
            )}

            {/* Description */}
            {model.description && (
                <div className="row mt-3">
                    <div className={labelColumnClassName}>
                        Mô tả
                    </div>
                    <div className={fieldColumnClassName}>
                        <span>{model.description}</span>
                    </div>
                </div>
            )}
        </MainBlock>
    );
};

interface DeleteButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    isDeleting: boolean;
    onClick: () => any;
}

const DeleteButton = ({ isDeleting, onClick, ...rest }: DeleteButtonProps) => {
    // const { isDeleting, onClick, ...rest } = props;

    const className = useMemo<string>(() => {
        let className = "btn btn-outline-danger btn-sm";
        if (rest.className) {
            className += ` ${rest.className}`;
        }

        if (isDeleting) {
            className += "placeholder disabled";
        }

        return className;
    }, [rest.className]);

    const icon = useMemo<React.ReactNode>(() => {
        if (isDeleting) {
            return (
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
            );
        }

        return <i className="bi bi-trash3" />;
    }, [isDeleting]);
    
    return (
        <button className={className} disabled={isDeleting} {...rest} onClick={onClick}>
            {icon}
        </button>
    );
};

export default ProductDetail;