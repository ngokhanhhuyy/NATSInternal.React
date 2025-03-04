import { useState, useMemo, useEffect, useTransition, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { type ProductCategoryListModel }
    from "@/models/product/productCategory/productCategoryListModel";
import { type BrandListModel } from "@/models/product/brand/brandListModel";
import { useProductCategoryService } from "@/services/productCategoryService";
import { useBrandService } from "@/services/brandService";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";
import CreatingLink from "@/views/layouts/CreateLinkComponent";

// Services.
const brandService = useBrandService();
const categoryService = useProductCategoryService();

interface SecondaryListProps<
        TList extends
            IUpsertableListModel<TBasic, TAuthorization> &
            IClonableModel<TList>,
        TBasic extends IProductGroupingBasicModel<TAuthorization>,
        TAuthorization extends IUpsertableExistingAuthorizationModel> {
    resourceType: string;
    iconClassName: string;
    isInitialRendering: boolean;
    initialModel: TList;
    reload(model: TList): Promise<TList>;
}

const SecondaryList = <
            TList extends
                IUpsertableListModel<TBasic, TAuthorization> &
                IClonableModel<TList>,
            TBasic extends IProductGroupingBasicModel<TAuthorization>,
            TAuthorization extends IUpsertableExistingAuthorizationModel>
        (props: SecondaryListProps<TList, TBasic, TAuthorization>) => {
    // Dependencies.
    const initialDataStore = useInitialDataStore();

    // Model and states.
    const [isReloading, startReloadingTransition] = useTransition();
    const [model, setModel] = useState<TList>(() => props.initialModel);

    // Computed.
    const resourceDisplayName = useMemo<string>(() => {
        return initialDataStore.getDisplayName(props.resourceType);
    }, [props.resourceType]);

    // Effect.
    useEffect(() => {
        if (!props.isInitialRendering) {
            startReloadingTransition(async () => {
                const reloadedModel = await props.reload(model);
                setModel(reloadedModel);
            });
        }
    }, [model.page]);

    // Memo.
    const listClassName = useMemo<string>(() => {
        return isReloading ? "opacity-50 pe-none" : "";
    }, [isReloading]);

    // Header
    const computeHeader = (): ReactNode => (
        <>
            <CreatingLink to={model.createRoute} canCreate={model.canCreate} hideText />
            {model.pageCount && (
                <>
                    {/* Previous page button */}
                    <button
                        className="btn btn-outline-primary btn-sm mx-1"
                        onClick={() => {
                            setModel(m => m.from({ page: m.page - 1 } as Partial<TList>));
                        }}
                        disabled={!model.pageCount || model.page === 1}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>

                    {/* Next page button */}
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                            setModel(m => m.from({ page: m.page + 1 } as Partial<TList>));
                        }}
                        disabled={!model.pageCount || model.page === model.pageCount}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </>
            )}
        </>
    );

    // Content
    const computeContent = (): ReactNode => {
        if (model.items.length) {
            return (
                <ul className={`list-group list-group-flush ${listClassName}`}>
                    {model.items.map((item) => (
                        <li className="list-group-item bg-transparent ps-3 p-2 d-flex
                                        justify-content-start align-items-center"
                                key={item.id}>
                            <i className={`me-3 ${props.iconClassName}`}></i>
    
                            {/* Name */}
                            <div className="flex-fill fw-bold">
                                {item.name}
                            </div>
    
                            {/* Edit button */}
                            {item.authorization?.canEdit && (
                                <Link className="btn btn-outline-primary btn-sm"
                                        to={item.updateRoute}>
                                    <i className="bi bi-pencil-square"></i>
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            );
        }

        return (
            <div className="d-flex justify-content-center align-items-center p-3">
                <span className="opacity-50">Không có {resourceDisplayName}</span>
            </div>
        );
    };

    return (
        <MainBlock
            title={resourceDisplayName.toUpperCase()}
            header={computeHeader()}
            bodyPadding="0"
        >
            {computeContent()}
        </MainBlock>
    );
};

interface Props<TList extends BrandListModel | ProductCategoryListModel> {
    isInitialRendering: boolean;
    initialModel: TList;
}

const ProductCategoryList = (props: Props<ProductCategoryListModel>) => {
    return (
        <SecondaryList
            resourceType="category"
            iconClassName="bi bi-tag-fill"
            isInitialRendering={props.isInitialRendering}
            initialModel={props.initialModel}
            reload={async (model) => {
                const responseDto = await categoryService.getListAsync(model.toRequestDto());
                return model.fromListResponseDto(responseDto);
            }}
        />
    );
};

const BrandList = (props: Props<BrandListModel>) => {
    return (
        <SecondaryList
            resourceType="brand"
            iconClassName="bi bi-tag-fill"
            isInitialRendering={props.isInitialRendering}
            initialModel={props.initialModel}
            reload={async (model) => {
                const responseDto = await brandService.getListAsync(model.toRequestDto());
                return model.fromListResponseDto(responseDto);
            }}
        />
    );
};

export { ProductCategoryList, BrandList };