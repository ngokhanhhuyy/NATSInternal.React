import { useState, useMemo, useEffect, useTransition } from "react";
import type { ReactNode, TransitionStartFunction } from "react";
import { Link } from "react-router-dom";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { type ProductCategoryListModel }
    from "@/models/product/productCategory/productCategoryListModel";
import { type ProductCategoryBasicModel }
    from "@/models/product/productCategory/productCategoryBasicModel";
import { type BrandListModel } from "@/models/product/brand/brandListModel";
import { type BrandBasicModel } from "@/models/brandModels";
import { useProductCategoryService } from "@/services/productCategoryService";
import { useBrandService } from "@/services/brandService";
import { ValidationError } from "@/errors";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";
import CreatingLink from "@/views/layouts/CreateLinkComponent";

// Services.
const brandService = useBrandService();
const productCategoryService = useProductCategoryService();

interface SecondaryListProps<
        TList extends
            IUpsertableListModel<TBasic, TAuthorization> &
            IClonableModel<TList>,
        TBasic extends IUpsertableBasicModel<TAuthorization>,
        TAuthorization extends IUpsertableExistingAuthorizationModel> {
    resourceType: string;
    iconClassName: string;
    isInitialRendering: boolean;
    initialModel: TList;
    reload(model: TList, startReloadTransition: TransitionStartFunction): Promise<void>;
    renderItemContent(item: TBasic): ReactNode;
}

const SecondaryList = <
            TList extends
                IUpsertableListModel<TBasic, TAuthorization> &
                IClonableModel<TList>,
            TBasic extends IUpsertableBasicModel<TAuthorization>,
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
            props.reload(model, startReloadingTransition);
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
                                {props.renderItemContent(item)}
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
            reload={}
        />
    );
};

const BrandList = ({ isInitialRendering: isInitialLoading, onInitialLoadingFinished }: Props) => {
    const service = useMemo(() => useBrandService(), []);

    return (
        <SecondaryList resourceType="brand" iconClassName="bi bi-building"
                isInitialRendering={isInitialLoading}
                onInitialLoadingFinished={onInitialLoadingFinished}
                initializeModel={requestDto => new BrandListModel(requestDto)}
                initialLoadAsync={async (model, setModel) => {
                    const [responseDto, canCreate] = await Promise.all([
                        service.getListAsync(model.toRequestDto()),
                        service.getCreatingPermissionAsync()
                    ]);
                    setModel(model => model.fromResponseDtos(responseDto, canCreate));
                }}
                reloadAsync={async (model, setModel) => {
                    const responseDto = await service.getListAsync(model.toRequestDto());
                    setModel(model => model.fromResponseDtos(responseDto));
                }}
                getCreatingPermissionAsync={service.getCreatingPermissionAsync}
                onPageChanged={(setModel, page) => {
                    setModel(model => model.from({ page }));
                }} />
    );
};

export { ProductCategoryList, BrandList };