import React, { useMemo } from "react";
import type { ClonableArrayModel } from "@/models/arrayModel";
import type { SupplyUpsertItemModel } from "@/models/supply/supplyItem/supplyUpsertItemModel";
import type { IModelState } from "@/hooks/modelStateHook";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Form component.
import MoneyInput from "@/views/form/MoneyInputComponent";

// Props.
interface SupplyItemListProps {
    model: ClonableArrayModel<SupplyUpsertItemModel>;
    modelState: IModelState;
    onChange(model: ClonableArrayModel<SupplyUpsertItemModel>): void;
}

interface SupplyItemProps {
    index: number;
    model: SupplyUpsertItemModel;
    onChange(index: number, model: SupplyUpsertItemModel): void;
    onDelete(index: number, item: SupplyUpsertItemModel): void;
}

// Component.
const SupplyItemList = ({ model, modelState, onChange }: SupplyItemListProps) => {
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

    // Callbacks.
    const handleItemChange = (index: number, item: SupplyUpsertItemModel) => {
        onChange(model.replace(index, item));
    };

    const handleItemDelete = (index: number) => {
        onChange(model.remove(index));
    };

    return (
        <MainBlock title={blockTitle}
                color={blockColor}
                className="h-100"
                bodyPadding="0"
                bodyClassName="d-flex justify-content-center align-items-start">
            {model.length > 0 ? (
                <ul className="list-group list-group-flush w-100">
                    {model.map((item, index) => (
                        <SupplyItem index={index} model={item} key={index}
                                onChange={handleItemChange}
                                onDelete={handleItemDelete} />
                    ))}
                </ul>
            ) : (
                <span className="opacity-50 align-self-center p-4">
                    Chưa chọn sản phẩm
                </span>
            )}
        </MainBlock>
    );
};

const SupplyItem = ({ index, model, onChange, onDelete }: SupplyItemProps) => {
    // Memo.
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
    
    if (model.hasBeenDeleted) {
        return null;
    }

    return (
        <li className="list-group-item d-flex align-items-center w-100 bg-transparent"
                id={`item-${index}`}>
            {/* Thumbnail */}
            <img className="img-thumbnail product-thumbnail me-2" style={thumbnailStyle}
                    src={model.product.thumbnailUrl }/>
    
            {/* Detail */}
            <div className="d-flex flex-column flex-fill item-detail
                            h-100 ms-2 py-2 overflow-hidden">
                <div className="fw-bold product-name small" style={productNameStyle}>
                    {model.product.name}
                </div>
                <div className="d-flex justify-content-end ms-1">
                    {/* Amount and SuppliedQuantity */}
                    <div className="input-group input-group-sm amount-quantity-container ms-1">
                        <MoneyInput className="small text-end border-end-0 flex-shrink-0"
                                suffix=" vnđ"
                                value={model.productAmountPerUnit}
                                onValueChanged={productAmountPerUnit => {
                                    onChange(index, model.from({ productAmountPerUnit }));
                                }} />
                        <MoneyInput className="small text-end flex-shrink-0"
                                style={{ maxWidth: "60px", marginLeft: -1 }}
                                prefix="×" min={1} max={99}
                                value={model.quantity}
                                onValueChanged={quantity => {
                                    onChange(index, model.from({ quantity }));
                                }} />
                    </div>
                    {/* Delete button */}
                    <button className="btn btn-outline-danger btn-sm flex-shrink-0 ms-2"
                            onClick={() => onDelete(index, model)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default SupplyItemList;