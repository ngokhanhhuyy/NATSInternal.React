import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { SupplyUpsertItemModel } from "@/models/supply/supplyItem/supplyUpsertItemModel";
import type { IModelState } from "@/hooks/modelStateHook";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Props.
interface SupplyItemListProps {
    model: SupplyUpsertItemModel[];
    modelState: IModelState;
    onEdit(index: number): void | Promise<void>;
    onUnpicked(index: number): void;
}

interface SupplyItemProps {
    index: number;
    model: SupplyUpsertItemModel;
    onEdit(): void;
    onUnpicked(): void;
}

// Component.
const SupplyItemList = (props: SupplyItemListProps) => {
    const { model, modelState, onEdit, onUnpicked } = props;

    // Dependency.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const blockTitle = useMemo<string>(() => {
        if (modelState.hasError("items")) {
            return modelState.getMessage("items");
        }

        return "Sản phẩm đã chọn";
    }, [modelState.hasError("items")]);

    const blockColor = useMemo<"primary" | "danger">(() => {
        return modelState.hasError("items") ? "danger" : "primary";
    }, [modelState.hasError("items")]);

    const computeAmountTexts = (): string => {
        const amount = model.reduce((total, currentItem) => {
            return total + (currentItem.productAmountPerUnit * currentItem.quantity);
        }, 0);

        return amountUtility.getDisplayText(amount);
    };

    const computedAmountTexts = computeAmountTexts();

    return (
        <MainBlock
            title={blockTitle}
            color={blockColor}
            className="h-100"
            bodyPadding="0"
            bodyClassName="d-flex justify-content-center align-items-start"
        >
            {model.length > 0 ? (
                <ul className="list-group list-group-flush w-100">
                    {model.map((item, index) => (
                        <SupplyItem
                            index={index}
                            model={item}
                            onEdit={() => onEdit(index)}
                            onUnpicked={() => onUnpicked(index)}
                            key={index}
                        />
                    ))}
                    <li className="list-group-item d-flex justify-content-end
                                    align-items-center small bg-transparent">
                        <span className="fw-bold me-3">Tổng cộng:</span>
                        <span className="text-primary">
                            {computedAmountTexts}
                        </span>
                    </li>
                </ul>
            ) : (
                <span className="opacity-50 align-self-center p-4">
                    Chưa chọn sản phẩm nào
                </span>
            )}
        </MainBlock>
    );
};

const SupplyItem = ({ index, model, onEdit, onUnpicked }: SupplyItemProps) => {
    // Dependencies.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const thumbnailStyle = useMemo<React.CSSProperties>(() => ({
        width: "60px",
        height: "60px",
        objectFit: "cover",
        objectPosition: "50% 50%"
    }), []);

    const productNameStyle = useMemo<React.CSSProperties>(() => ({
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: "100%"
    }), []);

    const computeTotalAmountText = () => {
        return amountUtility.getDisplayText(model.productAmountPerUnit * model.quantity);
    };
    
    if (model.hasBeenDeleted) {
        return null;
    }

    return (
        <li className="list-group-item d-flex align-items-center w-100 bg-transparent"
                id={`item-${index}`}>
            {/* Thumbnail */}
            <Link to={model.product.detailRoute} className="me-2">
                <img className="img-thumbnail product-thumbnail"
                        style={thumbnailStyle}
                    src={model.product.thumbnailUrl }
                />
            </Link>
    
            {/* Detail */}
            <div className="d-flex flex-column flex-fill item-detail
                            h-100 ms-2 py-2 overflow-hidden">
                {/* ProductName */}
                <Link to={model.product.detailRoute} className="fw-bold small"
                        style={productNameStyle}>
                    {model.product.name}
                </Link>

                {/* Item Detail */}
                <div className="small">
                    {/* ProductAmountPerUnit */}
                    <span>
                        {amountUtility.getDisplayText(model.productAmountPerUnit)}
                    </span> ×&nbsp;

                    {/* Quantity */}
                    <span>
                        {model.quantity} {model.product.unit.toLowerCase()}
                    </span><br/>

                    {/* Total */}
                    <span className="fw-bold me-2">
                        Tổng: 
                    </span>
                    <span>
                        {computeTotalAmountText()}
                    </span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="d-flex">
                {/* Edit button */}
                <button type="button"
                        className="btn btn-outline-primary btn-sm flex-shrink-0 ms-2"
                        onClick={onEdit}>
                    <i className="bi bi-pencil-square"></i>
                </button>

                {/* Delete button */}
                <button type="button"
                        className="btn btn-outline-danger btn-sm flex-shrink-0 ms-2"
                        onClick={() => onUnpicked()}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
        </li>
    );
};

export default SupplyItemList;