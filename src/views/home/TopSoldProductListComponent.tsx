import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import type { TopSoldProductListModel } from "@/models/stats/topSoldProductListModel";
import type { TopSoldProductModel } from "@/models/stats/topSoldProductModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout components.
import MainBlock from "../layouts/MainBlockComponent";

// Props.
interface TopSoldProductListProps {
    model: TopSoldProductListModel;
}

interface TopSoldProductProps {
    model: TopSoldProductModel;
    isCriteriaByAmount: boolean;
}

// Component.
const TopSoldProductList = (props: TopSoldProductListProps) => {
    // Computed.
    const isCriteriaByAmount = useMemo(() => {
        return props.model.criteria === "Amount";
    }, [props.model.criteria]);

    return (
        <MainBlock
            title="Sản phẩm bán chạy nhất"
            bodyPadding={0}
            className="h-100"
            bodyClassName="h-100 overflow-hidden"
        >
            <ul className="list-group list-group-flush">
                {props.model.items.length > 0
                    ? props.model.items.map((product, index) => (
                        <TopSoldProduct
                            model={product}
                            isCriteriaByAmount={isCriteriaByAmount}
                            key={index}
                        />
                    )) : (
                        <li className="list-group-item d-flex align-items-center
                                        justify-content-center bg-transparent py-4 opacity-50">
                            Không có sản phẩm nào
                        </li>
                    )}
            </ul>
        </MainBlock>
    );
};

const TopSoldProduct = (props: TopSoldProductProps) => {
    // Dependencies.
    const amountUtility = useAmountUtility();

    // Computed.
    const detailContainerStyle: React.CSSProperties = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    };

    return (
        <li
            className="list-group-item d-flex align-items-center bg-transparent"
            style={{ height: 65 }}
        >
            <Link
                to={props.model.detailRoute}
                className="d-flex justify-content-center align-items-center
                            flex-shrink-0 me-2"
            >
                <img
                    className="img-thumbnail"
                    src={props.model.thumbnailUrl}
                    style={{ aspectRatio: 1, height: 40 }}
                />
            </Link>
            <div className="flex-fill" style={detailContainerStyle}>
                {/* Name */}
                <Link to={props.model.detailRoute} className="fw-bold">
                    {props.model.name}
                </Link><br/>

                {/* Detail by criteria */}
                <span className="opacity-50 small">
                    {props.isCriteriaByAmount
                        ? amountUtility.getDisplayText(props.model.amount)
                        : <>{props.model.quantity} {props.model.unit}</>
                    }
                </span>
            </div>
        </li>
    );
};

export default TopSoldProductList;