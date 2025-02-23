import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { type TopPurchasedCustomerListModel }
    from "@/models/stats/topPurchasedCustomerListModel";
import type { TopPurchasedCustomerModel } from "@/models/stats/topPurchasedCustomerModel";
import { useAmountUtility } from "@/utilities/amountUtility";

// Layout components.
import MainBlock from "../layouts/MainBlockComponent";

// Props.
interface TopPurchasedCustomerListProps {
    model: TopPurchasedCustomerListModel;
}

interface TopPurchasedCustomerProps {
    model: TopPurchasedCustomerModel;
    isCriteriaByPurchasedAmount: boolean;
}

// Component.
const TopSoldProductList = (props: TopPurchasedCustomerListProps) => {
    // Computed.
    const isCriteriaByPurchasedAmount = useMemo(() => {
        return props.model.criteria === "PurchasedAmount";
    }, [props.model.criteria]);

    return (
        <MainBlock
            title="Khách hàng mua nhiều nhất"
            bodyPadding={0}
            className="h-100"
            bodyClassName="h-100 overflow-hidden"
        >
            <ul className="list-group list-group-flush">
                {props.model.items.length > 0
                    ? props.model.items.map((customer, index) => (
                        <TopPurchasedCustomer
                            model={customer}
                            isCriteriaByPurchasedAmount={isCriteriaByPurchasedAmount}
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

const TopPurchasedCustomer = (props: TopPurchasedCustomerProps) => {
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
                className="d-flex justify-content-center align-items-centerflex-shrink-0 me-2"
            >
                <img
                    className="img-thumbnail rounded-circle"
                    src={props.model.avatarUrl}
                    style={{ aspectRatio: 1, height: 40 }}
                />
            </Link>
            <div className="flex-fill" style={detailContainerStyle}>
                {/* Fullname */}
                <Link to={props.model.detailRoute} className="fw-bold">
                    {props.model.fullName}
                </Link><br/>

                {/* Detail by criteria */}
                <span className="opacity-50 small">
                    {props.isCriteriaByPurchasedAmount
                        ? amountUtility.getDisplayText(props.model.purchasedAmount)
                        : <>{props.model.purchasedTransactionCount} giao dịch</>
                    }
                </span>
            </div>
        </li>
    );
};

export default TopSoldProductList;