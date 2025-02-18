import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { IModelState } from "@/hooks/modelStateHook";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Props.
interface PickedItemListProps<TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>> {
    model: TUpsertItem[];
    modelState: IModelState;
    onEdit: (index: number) => void | Promise<void>;
    onUnpicked: (index: number) => void;
}

interface PickedItemProps<TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>> {
    index: number;
    model: TUpsertItem;
    onEdit: () => void;
    onUnpicked: () => void;
}

// Component.
const PickedItemList = <TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>>
    ({ model, modelState, onEdit, onUnpicked }: PickedItemListProps<TUpsertItem>) =>
{
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

    const computeAmountTexts = () => {
        let itemsAmount = 0, vatAmount = 0;
        model.forEach(i => {
            itemsAmount += i.productAmountPerUnit * i.quantity;
            vatAmount += i.vatAmountPerUnit * i.quantity;
        });

        return {
            itemsAmount: amountUtility.getDisplayText(itemsAmount),
            vatAmount: amountUtility.getDisplayText(vatAmount),
            totalAmount: amountUtility.getDisplayText(itemsAmount + vatAmount)
        };
    };

    const computedAmountTexts = computeAmountTexts();

    return (
        <MainBlock
            title={blockTitle}
            color={blockColor}
            className="h-100"
            bodyPadding={0}
        >
            <ul className="list-group list-group-flush h-100">
                {model.length
                    ? (
                        <>
                            {model.map((item, index) => (
                                <Item
                                    index={index}
                                    model={item}
                                    onEdit={() => onEdit(index)}
                                    onUnpicked={() => onUnpicked(index)}
                                    key={index}
                                />
                            ))}
                            <li className="list-group-item d-flex flex-column align-items-end
                                            small bg-transparent">
                                <span>{computedAmountTexts.itemsAmount}</span>
                                <span>VAT {computedAmountTexts.vatAmount}</span>
                                <div className="border-top mt-1 pt-1">
                                    <span className="fw-bold me-3">Tổng cộng</span>
                                    <span className="text-primary">
                                        {computedAmountTexts.totalAmount}
                                    </span>
                                </div>
                            </li>
                        </>
                    ) : (
                        <li className="list-group-item d-flex justify-content-center
                                        align-items-center p-3 bg-transparent h-100">
                            <span className="opacity-50">
                                Chưa chọn sản phẩm nào
                            </span>
                        </li>
                    )}

            </ul>
        </MainBlock>
    );
};

const Item = <TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>>
        ({ index, model, onEdit, onUnpicked }: PickedItemProps<TUpsertItem>) =>
{    // Dependencies.
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
        const amount = (model.productAmountPerUnit + model.vatAmountPerUnit) * model.quantity;
        return amountUtility.getDisplayText(amount);
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

                    {/* VatPercentagePerUnit */}
                    
                    <span>
                        {model.vatPercentagePerUnit}% (VAT)
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

export default PickedItemList;