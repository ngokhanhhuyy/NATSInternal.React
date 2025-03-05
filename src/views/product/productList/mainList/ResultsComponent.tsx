import React, { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { ProductBasicModel } from "@/models/product/productBasicModel";
import { usePhotoUtility } from "@/utilities/photoUtility";
import { useAmountUtility } from "@/utilities/amountUtility";
import * as styles from "./ResultsComponent.module.css";

// Placeholder component.
import Button from "@form/ButtonComponent";
import PlaceholderText from "@/views/shared/placeholder/PlaceholderTextComponent";

// Component.
interface ResultsProps {
    model: Readonly<ProductBasicModel[]>;
    isInitialLoading: boolean;
    isReloading: boolean;
}

const Results = ({ model, isReloading }: ResultsProps) => {
    // Computed.
    const computeUlClassName = (): string => {
        const classNames = ["list-group list-group-flush transition-reloading"];
        if (isReloading) {
            classNames.push("opacity-50 pe-none");
        }

        return classNames.join(" ");
    };

    return (
        <div className="border rounded-3 bg-white overflow-hidden">
            <ul className={computeUlClassName()}>
                {model.length > 0
                    ? model.map(item => <Item model={item} key={item.id} />)
                    : (
                        <li className="list-group-item d-flex flex-row justify-content-center
                                        align-items-center opacity-50 p-3">
                            Không tìm thấy sản phẩm
                        </li>
                    )}

            </ul>
        </div>
    );
};

const Item = ({ model }: { model: ProductBasicModel }) => {
    // Dependencies.
    const navigate = useNavigate();
    const photoUtility = useMemo(usePhotoUtility, []);
    const amountUtility = useMemo(useAmountUtility, []);

    // Computed.
    const thumbnailUrl = model?.thumbnailUrl ?? photoUtility.getDefaultPlainPhotoUrl();
    const stockingQuantity = model?.stockingQuantity ?? 0;
    const unit = model?.unit.toLowerCase() ?? "";

    return (
        <li className="list-group-item bg-transparent d-flex flex-row justify-content-start
                        align-items-center px-3 py-2">
            {/* Thumbnail */}
            <img className={`img-thumbnail ${styles["thumbnail"]}`}
                src={thumbnailUrl}
                onClick={() => model && navigate(model.detailRoute)}
            />

            {/* Detail */}
            <div className={`px-3 d-flex flex-column flex-fill justify-content-center
                            align-items-start ${styles["additionalInfo"]}`}>
                {/* Name */}
                <Link className="fw-bold" to={model.detailRoute}>
                    {model.name}
                </Link>

                <div className="d-flex">
                    {/* Price */}
                    <span className="bg-success-subtle text-success small px-2
                                    rounded border border-success-subtle me-2">
                        <i className="bi bi-cash-coin me-1"></i>
                        {model && amountUtility.getDisplayText(model.defaultPrice)}
                        {!model && <PlaceholderText width={100} />}
                    </span>

                    {/* Quantity */}
                    <span className="bg-primary-subtle text-primary small px-2
                                    rounded border border-primary-subtle">
                        <i className="bi bi-archive me-1"></i>
                        {stockingQuantity} {unit}
                    </span>
                </div>
            </div>

            {/* Route */}
            <Button className="btn btn-outline-primary btn-sm m-2 flex-shrink-0"
                    isPlaceholder={!model}
                    onClick={() => model && navigate(model.detailRoute)}>
                <i className="bi bi-info-circle"></i>
                <span className="d-md-inline d-sm-none d-none ms-2">Chi tiết</span>
            </Button>
        </li>
    );
};

export default Results;