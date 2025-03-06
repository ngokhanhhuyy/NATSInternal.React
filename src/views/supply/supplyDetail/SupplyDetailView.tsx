import { Link } from "react-router-dom";
import { SupplyDetailModel } from "@/models/supply/supplyDetailModel";
import { useSupplyService } from "@/services/supplyService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child component
import SupplyDetail from "./SupplyDetailComponent";
import SupplyDetailItemList from "./SupplyDetailItemListComponent";
import SupplyUpdateHistoryList from "./SupplyUpdateHistoryListComponent";

// Component.
const SupplyDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const service = useSupplyService();
    
    // Model and states.
    useViewStates();
    const model = useAsyncModelInitializer({
        initializer: async () => {
            const responseDto = await service.getDetailAsync(id);
            return new SupplyDetailModel(responseDto);
        },
        cacheKey: "supplyDetail"
    });

    return (
        <MainContainer>
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