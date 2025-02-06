import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import type { DebtIncurrenceListModel } from "@/models/debtIncurrence/debtIncurrenceListModel";
import type { DebtPaymentListModel } from "@/models/debtPayment/debtPaymentListModel";
import { useInitialDataStore, type IInitialDataStore } from "@/stores/initialDataStore";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useRouteGenerator } from "@/router/routeGenerator";
import { ValidationError } from "@/errors";

// Layout components.
import MainBlock from "@/views/layouts/MainBlockComponent";

// Child component.
import Results from "./ResultsComponent";

// Props.
export interface Props<TListModel extends DebtIncurrenceListModel | DebtPaymentListModel> {
    displayName: (initialDataStore: IInitialDataStore) => string;
    color: "success" | "danger";
    listRoute: (routeGenerator: ReturnType<typeof useRouteGenerator>) => string;
    initializeModel(
        initialData: ResponseDtos.InitialData,
        requestDto: Partial<RequestDtos.IHasStatsList>): TListModel;
    loadAsync(
        model: TListModel,
        setModel: React.Dispatch<React.SetStateAction<TListModel>>): Promise<void>;
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => any;
}

// Component.
const DebtList = <TListModel extends DebtIncurrenceListModel | DebtPaymentListModel>
        (props: Props<TListModel>) => {
    // Dependencies.
    const initialDataStore = useInitialDataStore();
    const getSubmissionErrorConfirmationAsync = useAlertModalStore(store => {
        return store.getSubmissionErrorConfirmationAsync;
    });
    const routeGenerator = useMemo(useRouteGenerator, []);

    // Model and states.
    const [model, setModel] = useState(() => {
        const requestDto: Partial<RequestDtos.IHasStatsList> = { resultsPerPage: 5 };
        return props.initializeModel(initialDataStore.data, requestDto);
    });
    const [isReloading, setReloading] = useState<boolean>(() => false);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            if (!props.isInitialLoading) {
                setReloading(true);
            }

            try {
                await props.loadAsync(model, setModel);
            } catch (error) {
                if (error instanceof ValidationError) {
                    await getSubmissionErrorConfirmationAsync();
                    return;
                }

                throw error;
            }
        };

        loadAsync().finally(() => {
            if (props.isInitialLoading) {
                props.onInitialLoadingFinished();
            }

            setReloading(false);
        });
    }, []);

    if (props.isInitialLoading) {
        return null;
    }

    // Header.
    const header = (
        <Link to={props.listRoute(routeGenerator)}
                className={`btn btn-outline-${props.color} btn-sm`}>
            <i className="bi bi-list-ul me-2"></i>
            <span>Xem thêm</span>
        </Link>
    );

    return (
        <MainBlock
            title={`${props.displayName(initialDataStore)} gần nhất`}
            color={props.color}
            header={header}
            bodyPadding={0}
        >
            <Results
                model={model.items}
                displayName={props.displayName(initialDataStore)}
                isReloading={isReloading}
            />
        </MainBlock>
    );
};

export default DebtList;