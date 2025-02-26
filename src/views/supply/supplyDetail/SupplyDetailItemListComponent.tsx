import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { SupplyDetailItemModel } from "@/models/supply/supplyItem/supplyDetailItemModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Component.
const SupplyDetailItemList = ({ model }: { model: SupplyDetailItemModel[] }) => {
    return (
        <MainBlock
            title="Danh sách sản phẩm"
            className="h-100"
            bodyClassName="overflow-hidden"
            bodyPadding={0}
        >
            <ul className="list-group list-group-flush">
                {/* Items */}
                {model.map(item => <SupplyDetailItem model={item} key={item.id} />)}
            </ul>
        </MainBlock>
    );
};

const SupplyDetailItem = ({ model }: { model: SupplyDetailItemModel }) => {
    // Dependency.
    const amountUtility = useMemo(useAmountUtility, []);
    
    // Computed.
    const computeAmountText = () => {
        const amount = model.productAmountPerUnit * model.quantity;
        return amountUtility.getDisplayText(amount);
    };

    const photoStyle = useMemo<React.CSSProperties>(() => ({
        objectFit: "cover",
        objectPosition: "50% 50%",
        width: "50px",
        height: "50px",
    }), []);

    return (
        <li className="list-group-item px-3 py-2 d-flex bg-transparent
                        justify-content-start align-items-center"
        >
            {/* Thumbnail */}
            <img className="img-thumbnail me-2 product-photo"
                src={model.product.thumbnailUrl}
                style={photoStyle}
            />
    
            {/* Detail   */}
            <div className="d-flex flex-column flex-fill pe-2">
                {/* Product name */}
                <Link to={model.product.detailRoute} className="fw-bold small">
                    {model.product.name}
                </Link>
    
                {/* Item amount + Supplied quantity */}
                <span className="small">
                    {amountUtility.getDisplayText(model.productAmountPerUnit)}&nbsp;×&nbsp;
                    {model.quantity} {model.product.unit.toLowerCase()}&nbsp;=&nbsp;
                    <b>{computeAmountText()}</b>
                </span>
            </div>
        </li>
    );
};

export default SupplyDetailItemList;