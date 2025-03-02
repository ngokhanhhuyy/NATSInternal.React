import React from "react";
import { Link } from "react-router-dom";
import { type LatestTransactionModel } from "@/models/stats/latestTransactionModel";
import { TransactionType } from "@/services/dtos/enums";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Layout component.
import MainBlock from "../layouts/MainBlockComponent";

// Props.
interface LatestTransactionListProps {
    model: LatestTransactionModel[];
}

// Component.
const LatestTransactionList = (props: LatestTransactionListProps) => {
    return (
        <MainBlock
            title="Giao dịch mới nhất"
            className="h-100"
            bodyPadding={0}
            bodyClassName="h-100 overflow-hidden"
        >
            <ul className="list-group list-group-flush">
                {props.model.length > 0 ? props.model.map((transaction, index) => (
                    <LatestTransactionItem model={transaction} key={index} />
                )) : (
                    <li className="list-group-item d-flex align-items-center
                                    justify-content-center bg-transparent py-4 opacity-50">
                        Không có giao dịch nào
                    </li>
                )}
            </ul>
        </MainBlock>
    );
};

const LatestTransactionItem = ({ model }: { model: LatestTransactionModel }) => {
    // Dependencies.
    const getDisplayName = useInitialDataStore(store => store.getDisplayName);

    // Computed.
    const iconContainerStyle: React.CSSProperties = {
        aspectRatio: 1,
        height: 40
    };

    const computeColor = (): string => {
        const typeColors: Record<TransactionType, string> = {
            [TransactionType.Expense]: "primary",
            [TransactionType.Supply]: "success",
            [TransactionType.Consultant]: "orange",
            [TransactionType.Order]: "info",
            [TransactionType.Treatment]: "purple",
            [TransactionType.DebtIncurrence]: "success",
            [TransactionType.DebtPayment]: "danger"
        };
        
        return typeColors[model.type];
    };
    
    const computeIconClassName = (): string => {
        const typeColors: Record<TransactionType, string> = {
            [TransactionType.Expense]: "bi-cash-coin",
            [TransactionType.Supply]: "bi-truck",
            [TransactionType.Consultant]: "bi-patch-question",
            [TransactionType.Order]: "bi-cart4",
            [TransactionType.Treatment]: "bi-magic",
            [TransactionType.DebtIncurrence]: "bi-hourglass-bottom",
            [TransactionType.DebtPayment]: "bi-hourglass-bottom"
        };
        
        return `${typeColors[model.type]} text-${computeColor()}`;
    };
    
    const computeIconContainerClassName = (): string => {
        const color = computeColor();
        return `bg-${color}-subtle border-${color}`;
    };
    
    const computeDisplayName = (): string => {
        const typeName = TransactionType[model.type];
        const camelCaseTypeName = typeName[0].toLowerCase() +
            typeName.substring(1, typeName.length);
        return getDisplayName(camelCaseTypeName);
    };

    return (
        <li
            className="list-group-item d-flex align-items-center bg-transparent"
            style={{ height: 65 }}
        >
            <Link
                to={model.detailRoute}
                className={`p-2 d-flex justify-content-center align-items-center border
                            rounded-circle flex-shrink-0 me-3
                            ${computeIconContainerClassName()}`}
                style={iconContainerStyle}
            >
                <i className={`bi ${computeIconClassName()}`} />
            </Link>
            <div className="flex-fill">
                <Link
                    to={model.detailRoute}
                    className={`fw-bold text-${computeColor()}`}
                >
                    {computeDisplayName()}
                </Link>
                <br/>
                <span className="opacity-50 small">
                    {model.statsDateTime.deltaText}
                </span>
            </div>
        </li>
    );
};

export default LatestTransactionList;