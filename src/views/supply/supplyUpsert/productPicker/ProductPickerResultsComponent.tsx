import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { ProductBasicModel } from "@/models/product/productBasicModel";
import type { SupplyUpsertItemModel } from "@/models/supply/supplyItem/supplyUpsertItemModel";
import { usePhotoUtility } from "@/utilities/photoUtility";

// Props.
interface ResultsProps {
    isReloading: boolean;
    productsModel: ProductBasicModel[];
    productsModelResultsPerPage: number;
    supplyItemsModel: SupplyUpsertItemModel[];
    onPicked(product: ProductBasicModel): void;
}

interface ItemProps {
    model: ProductBasicModel;
    isPickable: boolean;
    isMaximumQuantityExceeded?: boolean;
    onPicked: () => void;
}

// Component.
const Results = (props: ResultsProps) => {
    const { isReloading, productsModel, supplyItemsModel, onPicked } = props;

    // Computed.
    const pickedProductIds = supplyItemsModel.map(item => item.product.id);

    // Callback.
    const isMaximumQuantityExceeded = (product: ProductBasicModel) => {
        const supplyItem = supplyItemsModel.find(i => i.product.id === product.id);
        return (supplyItem?.quantity ?? 0) + 1 >= 100;
    };

    // Template.
    if (!isReloading && !productsModel.length) {
        // Fallback.
        return (
            <div className="border rounded p-4 d-flex mt-2
                            justify-content-center align-items-center">
                Không tìm thấy sản phẩm
            </div>
        );
    }

    // Results.
    return (
        <ul className="list-group">
            {productsModel.map(product => (
                <Item model={product} key={product.id}
                    isPickable={!pickedProductIds.includes(product.id)}
                    isMaximumQuantityExceeded={isMaximumQuantityExceeded(product)}
                    onPicked={() => onPicked(product)}
                />
            ))}
        </ul>
    );
};

const Item = (props: ItemProps) => {
    // Dependencies.
    const photoUtility = useMemo(usePhotoUtility, []);

    // Memo.
    const model = useMemo(() => props?.model, [props?.model]);
    const isPickable = useMemo(() => props?.isPickable ?? true, [props?.isPickable]);

    const thumbnailUrl = useMemo<string>(() => {
        return props.model?.thumbnailUrl ?? photoUtility.getDefaultPlainPhotoUrl();
    }, [props.model?.thumbnailUrl]);

    const thumbnailStyle = useMemo<React.CSSProperties>(() => ({
        width: "50px",
        height: "50px",
        objectFit: "cover",
        objectPosition: "50% 50%"
    }), []);

    const detailStyle = useMemo<React.CSSProperties>(() => ({
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    }), []);

    return (
        <li className="list-group-item p-2 d-flex align-items-center">
            {/* Thumbnail */}
            <Link to={model.detailRoute} className="flex-shrink-0 me-2">
                <img className="img-thumbnail" style={thumbnailStyle} src={thumbnailUrl} />
            </Link>

            {/* Detail */}
            <div className="flex-fill" style={detailStyle}>
                <Link to={model.detailRoute} className="fw-bold small">
                    {props.model.name}
                </Link><br/>
                
                <span className="small">
                    <span className="me-2">Còn lại trong kho:</span>
                    <span className={"badge bg-success-subtle text-success " +
                                    "border border-success-subtle"}>
                        {`${model.stockingQuantity} ${model.unit}`}
                    </span>
                </span>
            </div>

            {/* Pick button */}
            {isPickable && (
                <button className="btn btn-outline-success btn-sm flex-shrink-0 ms-2 me-1"
                        type="button"
                        onClick={props?.onPicked}>
                    <i className="bi bi-plus-lg" />
                </button>
            )}
        </li>
    );
};

export default Results;