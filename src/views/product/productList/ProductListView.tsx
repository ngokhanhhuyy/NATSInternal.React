import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useProductService } from "@/services/productService";
import { useBrandService } from "@/services/brandService";
import { useProductCategoryService } from "@/services/productCategoryService";
import { ProductListModel } from "@/models/product/productListModel";
import { BrandListModel } from "@/models/product/brand/brandListModel";
import { ProductCategoryListModel }
    from "@/models/product/productCategory/productCategoryListModel";
import { useInitialDataStore } from "@/stores/initialDataStore";
// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child components.
import MainList from "./mainList/MainListComponent";
import { ProductCategoryList, BrandList } from "./secondaryList/SecondaryListComponent";

const ProductListView = () => {
    // Dependencies.
    const productService = useProductService();
    const brandService = useBrandService();
    const productCategoryService = useProductCategoryService();
    const productInitialResponseDto = useInitialDataStore(store => store.data.product);

    // States.
    const { isInitialRendering } = useViewStates();
    const initialModels = useAsyncModelInitializer({
        initializer: async () => {
            const [
                productListResponseDto,
                brandOptionResponseDtos,
                categoryOptionResponseDtos,
                brandListResponseDto,
                categoryListResponseDto
            ] = await Promise.all([
                productService.getListAsync(),
                brandService.getAllAsync(),
                productCategoryService.getAllAsync(),
                brandService.getListAsync(),
                productCategoryService.getListAsync()
            ]);
            return {
                productList: new ProductListModel(
                    productListResponseDto,
                    brandOptionResponseDtos,
                    categoryOptionResponseDtos,
                    productInitialResponseDto),
                brandList: new BrandListModel(brandListResponseDto),
                categoryList: new ProductCategoryListModel(categoryListResponseDto)
            };
        },
        cacheKey: "productList"
    });

    return (
        <MainContainer>
            <div className="row g-0 p-0">
                {/* Left column */}
                <div className="col col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 p-0">
                    <MainList
                        isInitialRendering={isInitialRendering}
                        initialModel={initialModels.productList}
                    />
                </div>

                {/* Right column */}
                <div className="col p-0">
                    <div className="row g-3">
                        <div className="col col-xl-12 col-lg-6 col-md-6 col-sm-6 col-12">
                            {/* Brand */}
                            <BrandList
                                isInitialRendering={isInitialRendering}
                                initialModel={initialModels.brandList}
                            />
                        </div>
                        <div className="col col-xl-12 col-lg-6 col-md-6 col-sm-6 col-12">
                            <ProductCategoryList
                                isInitialRendering={isInitialRendering}
                                initialModel={initialModels.categoryList}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default ProductListView;