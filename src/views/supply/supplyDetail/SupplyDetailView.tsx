import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SupplyDetailModel } from "@/models/supply/supplyDetailModel";
import { useSupplyService } from "@/services/supplyService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { NotFoundError } from "@/errors";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child component
import SupplyDetail from "./SupplyDetailComponent";
import SupplyDetailItemList from "./SupplyDetailItemListComponent";
import SupplyUpdateHistoryList from "./SupplyUpdateHistoryListComponent";

// Component.
const SupplyDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const navigate = useNavigate();
    const alertModalStore = useAlertModalStore();
    const service = useSupplyService();
    
    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [model, setModel] = useState<SupplyDetailModel>();
    
    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                const responseDto = await service.getDetailAsync(id);
                setModel(new SupplyDetailModel(responseDto));
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    await navigate(-1);
                    return;
                }

                throw error;
            }
        };

        loadAsync().finally(() => onInitialLoadingFinished());
    }, []);

    if (!model) {
        return null;
    }

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3 justify-content-center">
                {/* Supply detail */}
                <div className="col col-xl-6 col-12">
                    <SupplyDetail model={model} />
                </div>
    
                {/* Supply items */}
                <div className="col">
                    <SupplyDetailItemList model={model.items} />
                </div>

                {/* Update histories */}
                {model.updateHistories.length > 0 && (
                    <div className="col col-12">
                        <SupplyUpdateHistoryList model={model.updateHistories} />
                    </div>
                )}
    
                {/* Edit button */}
                <div className="col col-12 d-flex justify-content-end">
                    {model.authorization.canEdit && (
                        <Link className="btn btn-primary" to={model.updateRoute}
                                v-if="model.authorization.canEdit">
                            <i className="bi bi-pencil-square me-2"></i>
                            <span>Sửa</span>
                        </Link>
                    )}
                </div>
            </div>
        </MainContainer>
    );
};

export default SupplyDetailView;