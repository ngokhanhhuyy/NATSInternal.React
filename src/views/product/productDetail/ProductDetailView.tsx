import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useProductService } from "@/services/productService";
import { useSupplyService } from "@/services/supplyService";
import { useOrderService } from "@/services/orderService";
import { useTreatmentService } from "@/services/treatmentService";
import { ProductDetailModel } from "@/models/product/productDetailModel";
import { SupplyListModel } from "@/models/supply/supplyListModel";
import { OrderListModel } from "@/models/order/orderListModel";
import { TreatmentListModel } from "@/models/treatment/treatmentListModel";

// Layout components.
import MainContainer from "@layouts/MainContainerComponent";

// Child component.
import ProductDetail from "./ProductDetailComponent";
import HasProductList from "./HasProductListComponent";

// Component.
const ProductDetailView = ({ id }: { id: number }) => {
    // Dependencies.
    const productService = useProductService();
    const supplyService = useSupplyService();
    const orderService = useOrderService();
    const treatmentService = useTreatmentService();

    // States.
    const initialModels = useAsyncModelInitializer({
        initializer: async () => {
            const requestDto = { productId: id, resultsPerPage: 5 };
            const [productDetail, supplyList, orderList, treatmentList] = await Promise.all([
                productService.getDetailAsync(id),
                supplyService.getListAsync(requestDto),
                orderService.getListAsync(requestDto),
                treatmentService.getListAsync(requestDto)
            ]);

            return {
                productDetail: new ProductDetailModel(productDetail),
                supplyList: new SupplyListModel(supplyList, undefined, requestDto),
                orderList: new OrderListModel(orderList, undefined, requestDto),
                treatmentList: new TreatmentListModel(treatmentList, undefined, requestDto)
            };
        },
        cacheKey: "productDetail"
    });

    const { isInitialRendering } = useViewStates();

    return (
        <MainContainer>
            <div className="row g-3">
                {/* Product Detail */}
                <div className="col col-xl-4 col-lg-5 col-md-5 col-sm-12 col-12
                                mb-md-0 mb-sm-3">
                    <ProductDetail model={initialModels.productDetail} />
                </div>

                {/* Recent supply, orders and treatments */}
                <div className="col">
                    <div className="d-flex flex-column">
                        {/* Most recent supplies */}
                        <HasProductList
                            productId={id}
                            resourceType="supply"
                            blockColor="primary"
                            isInitialRendering={isInitialRendering}
                            initialModel={initialModels.supplyList}
                            reloadAsync={async (model) => {
                                const responseDto = await supplyService
                                    .getListAsync(model.toRequestDto());
                                return model.fromListResponseDto(responseDto);
                            }}
                        />

                        {/* Most recent orders */}
                        <HasProductList
                            productId={id}
                            resourceType="order"
                            blockColor="success"
                            isInitialRendering={isInitialRendering}
                            initialModel={initialModels.orderList}
                            reloadAsync={async (model) => {
                                const responseDto = await orderService
                                    .getListAsync(model.toRequestDto());
                                return model.fromListResponseDto(responseDto);
                            }}
                        />

                        {/* Most recent treatments */}
                        <HasProductList
                            productId={id}
                            resourceType="treatment"
                            blockColor="danger"
                            isInitialRendering={isInitialRendering}
                            initialModel={initialModels.treatmentList}
                            reloadAsync={async (model) => {
                                const responseDto = await treatmentService
                                    .getListAsync(model.toRequestDto());
                                return model.fromListResponseDto(responseDto);
                            }}
                        />
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default ProductDetailView;