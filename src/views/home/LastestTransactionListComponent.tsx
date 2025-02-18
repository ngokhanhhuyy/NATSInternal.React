import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStatsService } from "@/services/statsService";
import { LastestTransactionModel } from "@/models/stats/lastestTransactionModel";
import { TransactionType } from "@/services/dtos/enums";
import { useInitialDataStore } from "@/stores/initialDataStore";

// Layout component.
import MainBlock from "../layouts/MainBlockComponent";

// Component.
const LastestTransactionList = () => {
    // Dependencies.
    const service = useMemo(useStatsService, []);

    // Model and states.
    const [model, setModel] = useState<LastestTransactionModel[]>(() => []);
    const [isInitialLoading, setInitialLoading] = useState<boolean>(() => true);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            const responseDto = await service.getLastestTransactionsAsync();
            setModel(responseDto.map(dto => new LastestTransactionModel(dto)));
        };

        loadAsync().finally(() => setInitialLoading(false));
    }, []);

    return (
        <MainBlock
            title="Giao dịch mới nhất"
            className="h-100"
            bodyPadding={0}
            bodyClassName="h-100 overflow-hidden"
        >
            {!isInitialLoading ? (
                <ul className="list-group list-group-flush">
                    {model.length > 0 ? model.map((transaction, index) => (
                        <LastestTransactionItem model={transaction} key={index} />
                    )) : (
                        <li className="list-group-item d-flex align-items-center
                                        justify-content-center bg-transparent py-4 opacity-50">
                            Không có giao dịch nào
                        </li>
                    )}
                </ul>
            ) : (

                <div className="d-flex justify-content-center align-items-center p-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">
                            Đang tải...
                        </span>
                    </div>
                    <span className="ms-2 text-primary">
                        Đang tải
                    </span>
                </div>
            )}
        </MainBlock>
    );
};

const LastestTransactionItem = ({ model }: { model: LastestTransactionModel }) => {
    // Dependencies.
    const getDisplayName = useInitialDataStore(store => store.getDisplayName);

    // Computed.

    // Computed.
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
        <li className="list-group-item d-flex align-items-center bg-transparent">
            <Link
                to={model.detailRoute}
                className={`p-2 d-flex justify-content-center align-items-center border
                            rounded-circle flex-shrink-0 transaction-icon-container me-3
                            ${computeIconContainerClassName()}`}
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

export default LastestTransactionList;