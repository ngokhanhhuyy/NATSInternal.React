import React, { useMemo } from "react";
import type { ProductBasicModel } from "@/models/product/productBasicModel";
import type { ClonableArrayModel } from "@/models/arrayModel";
import type { SupplyUpsertItemModel } from "@/models/supply/supplyItem/supplyUpsertItemModel";
import { usePhotoUtility } from "@/utilities/photoUtility";

// Props.
interface ResultsProps {
    isInitialLoading: boolean;
    isReloading: boolean;
    productsModel: ProductBasicModel[];
    productsModelResultsPerPage: number;
    supplyItemsModel: ClonableArrayModel<SupplyUpsertItemModel>;
    onPicked(product: ProductBasicModel): void;
    onQuantityIncremented(product: ProductBasicModel): void;
}

interface ItemProps {
    model?: ProductBasicModel;
    isPickable?: boolean;
    isMaximumQuantityExceeded?: boolean;
    onIncremented?: () => void;
    onPicked?: () => void;
}

// Component.
const Results = (props: ResultsProps) => {
    const {
        isInitialLoading,
        isReloading,
        productsModel,
        supplyItemsModel,
        onPicked,
        onQuantityIncremented
    } = props;

    // Computed.
    const pickedProductIds = supplyItemsModel.map(item => item.product.id);

    // Callback.
    const isMaximumQuantityExceeded = (product: ProductBasicModel) => {
        const supplyItem = supplyItemsModel.find(i => i.product.id === product.id);
        return (supplyItem?.quantity ?? 0) + 1 >= 100;
    };

    // Template.
    if (!isInitialLoading && !isReloading && !productsModel.length) {
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
        <>
            {isInitialLoading && (
                <ul className="list-group">
                    {Array.from(Array(props.productsModelResultsPerPage).keys()).map(index => (
                        <Item key={index} />
                    ))}
                </ul>
            )}

            {!isInitialLoading && (
                <ul className={`list-group ${isReloading ? "opacity-50 pe-none" : ""}`}>
                    {productsModel.map(product => (
                        <Item model={product} key={product.id}
                            isPickable={!pickedProductIds.includes(product.id)}
                            isMaximumQuantityExceeded={isMaximumQuantityExceeded(product)}
                            onIncremented={() => onQuantityIncremented(product)}
                            onPicked={() => onPicked(product)}
                        />
                    ))}
                </ul>
            )}
        </>
    );
};

const Item = (props: ItemProps) => {
    // Dependencies.
    const photoUtility = useMemo(usePhotoUtility, []);

    // Memo.
    const model = useMemo(() => props?.model, [props?.model]);
    const isPickable = useMemo(() => props?.isPickable ?? true, [props?.isPickable]);
    const isMaximumQuantityExceeded = useMemo(() => {
        return props?.isMaximumQuantityExceeded ?? true;
    }, [props?.isMaximumQuantityExceeded]);

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
            <img className="img-thumbnail me-2" style={thumbnailStyle} src={thumbnailUrl} />

            {/* Detail */}
            <div className="d-flex flex-column flex-fill" style={detailStyle}>
                <span className="small fw-bold">
                    {props?.model && props.model.name}
                    {!model && <span className="placeholder" style={{ width: 100 }} />}
                </span>
                <span className="small">
                    {model && `${model.stockingQuantity} ${model.unit}`}
                    {!model && (
                        <>
                            <span className="placeholder me-2" style={{ width: 10 }} />
                            <span className="placeholder" style={{ width: 50 }} />
                        </>
                    )}
                </span>
            </div>

            {model && (
                isPickable ? (
                    // Pick button
                    <button className="btn btn-outline-primary btn-sm flex-shrink-0 ms-2 me-1"
                            type="button"
                            onClick={props?.onPicked}>
                        <i className="bi bi-check2" />
                    </button>
                ) : (
                    // Increment button
                    <button className="btn btn-outline-success btn-sm flex-shrink-0 ms-2 me-1"
                            type="button"
                            onClick={() => props?.onIncremented?.()}
                            disabled={isMaximumQuantityExceeded}>
                        <i className="bi bi-plus-lg"></i>
                    </button>
                )
            )}
            {!model && (
                <button className="btn btn-outline-primary btn-sm flex-shrink-0 ms-2 me-1
                                    placeholder disabled"
                        type="button"
                        disabled>
                    <i className="bi bi-check2 opacity-0" />
                </button>
            )}
        </li>
    );
};

export default Results;