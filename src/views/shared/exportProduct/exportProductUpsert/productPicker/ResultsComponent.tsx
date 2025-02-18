import React, { useMemo } from "react";
import type { ProductBasicModel } from "@/models/product/productBasicModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Props.
interface ResultsProps<TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>> {
    isReloading: boolean;
    productListModel: ProductBasicModel[];
    pickedItemsListModel: TUpsertItem[];
    onPicked: (product: ProductBasicModel) => void;
}

interface ResultItemProps {
    model: ProductBasicModel;
    isPicked: boolean;
    onPicked: () => void;
}

// Component.
const Results = <TUpsertItem extends IExportProductUpsertItemModel<TUpsertItem>>
        (props: ResultsProps<TUpsertItem>) => {
    const { isReloading, productListModel, pickedItemsListModel, onPicked } = props;

    // Computed.
    const className = isReloading ? "opacity-50 pe-none" : "";

    const isPicked = (product: ProductBasicModel) => {
        return pickedItemsListModel.map(i => i.product!.id).includes(product.id);
    };

    return (
        <ul className={`list-group ${className}`}>
            {productListModel.length
                ? productListModel.map(product => (
                    <ResultItem
                        model={product}
                        isPicked={isPicked(product)}
                        onPicked={() => onPicked(product)}
                        key={product.id}
                    />
                )) : (
                    <li className="list-group-item bg-transparent d-flex
                                    justify-content-center align-items-center">
                        <span className="opacity-50">
                            Không tìm thấy kết quả
                        </span>
                    </li>
                )}
        </ul>
    );
};

const ResultItem = ({ model, isPicked, onPicked }: ResultItemProps) => {
    // Dependency.
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const thumbnailStyle = useMemo((): React.CSSProperties => ({
        width: "55px",
        height: "55px",
        objectFit: "contain",
        objectPosition: "50% 50%",
        aspectRatio: 1
    }), []);

    return (
        <li className="list-group-item d-flex justify-content-start
                        align-items-center overflow-hidden">
            {/* Product thumbnail */}
            <img
                className="img-thumbnail me-2"
                src={model.thumbnailUrl}
                style={thumbnailStyle}
            />

            {/* Name and details */}
            <div className="d-flex flex-column flex-fill overflow-hidden
                            justify-content-start  h-100">
                {/* Name */}
                <span className="fw-bold">{model.name}</span>

                {/* Price */}
                <div className="product-detail">
                    <span className="bg-success-subtle text-success px-2 py-1 rounded small">
                        <i className="bi bi-cash-coin me-1"></i>
                        {amountUtility.getDisplayText(model.defaultPrice)}
                    </span>

                    {/* Stocking quantity */}
                    <span className="bg-primary-subtle text-primary
                                    px-2 py-1 rounded small ms-2">
                        <i className="bi bi-archive me-1"></i>
                        {model.stockingQuantity} {model.unit.toLocaleLowerCase()}
                    </span>
                </div>
            </div>
            
            {/* Pick button */}
            {!isPicked && (
                <button className="btn btn-outline-success btn-sm"
                        type="button"
                        onClick={onPicked}>
                    <i className="bi bi-plus-lg"></i>
                </button>
            )}
        </li>
    );
};

export default Results;