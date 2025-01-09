import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { ProductCategoryListModel }
    from "@/models/product/productCategory/productCategoryListModel";
import { type ProductCategoryBasicModel }
    from "@/models/product/productCategory/productCategoryBasicModel";
import { BrandListModel } from "@/models/product/brand/brandListModel";
import { type BrandBasicModel } from "@/models/brandModels";
import { useProductCategoryService } from "@/services/productCategoryService";
import { useBrandService } from "@/services/brandService";
import { ValidationError } from "@/errors";

// Layout component.
import MainBlock from "@/views/layouts/MainBlockComponent";
import CreatingLink from "@/views/layouts/CreateLinkComponent";

type ListModel = ProductCategoryListModel | BrandListModel;

interface SecondaryListProps<TListModel> {
    resourceType: string;
    iconClassName: string;
    isInitialLoading: boolean;
    onInitialLoadingFinished(): void;
    initializeModel(requestDto: { resultsPerPage: number }): TListModel;
    initialLoadAsync(
        model: TListModel,
        setModel: React.Dispatch<React.SetStateAction<TListModel>>): Promise<void>;
    reloadAsync(
        model: TListModel,
        setModel: React.Dispatch<React.SetStateAction<TListModel>>): Promise<void>
    getCreatingPermissionAsync(): Promise<boolean>;
    onPageChanged(
        setModel: React.Dispatch<React.SetStateAction<TListModel>>,
        page: number): void;
}

const SecondaryList = <TListModel extends ListModel>
        (props: SecondaryListProps<TListModel>) => {
    // Dependencies.
    const alertModalStore = useAlertModalStore();
    const initialDataStore = useInitialDataStore();

    // Model and states.
    const [isReloading, setReloading] = useState<boolean>(false);
    const [model, setModel] = useState<TListModel>(() => {
        return props.initializeModel({ resultsPerPage: 10 });
    });

    // Memo.
    const resourceDisplayName = useMemo<string>(() => {
        return initialDataStore.getDisplayName(props.resourceType);
    }, [props.resourceType]);

    // Effect.
    useEffect(() => {
        const loadAsync = async () => {
            try {
                if (props.isInitialLoading) {
                    await props.initialLoadAsync(model, setModel);
                } else {
                    setReloading(true);
                    await props.reloadAsync(model, setModel);
                }
            } catch (error) {
                if (error instanceof ValidationError) {
                    await alertModalStore.getSubmissionErrorConfirmationAsync();
                    return;
                }

                throw error;
            } finally {
                if (props.isInitialLoading) {
                    props.onInitialLoadingFinished();
                }
            }
        };

        loadAsync().then(() => setReloading(false));
    }, [model.page]);

    // Memo.
    const listClassName = useMemo<string>(() => {
        return isReloading ? "opacity-50 pe-none" : "";
    }, [isReloading]);

    const header = (
        <>
            <CreatingLink to={model.createRoute} canCreate={model.canCreate} hideText />
            {model.pageCount && (
                <>
                    <button className="btn btn-outline-primary btn-sm mx-1"
                            onClick={() => props.onPageChanged(setModel, model.page - 1)}
                            disabled={!model.pageCount || model.page === 1}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button className="btn btn-outline-primary btn-sm"
                            onClick={() => props.onPageChanged(setModel, model.page + 1)}
                            disabled={!model.pageCount || model.page === model.pageCount}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </>
            )}
        </>
    );

    let bodyContent: React.ReactNode;
    if (model.items.length) {
        bodyContent = (
            <ul className={`list-group list-group-flush ${listClassName}`}>
                {model.items.map((item: ProductCategoryBasicModel | BrandBasicModel) => (
                    <li className="list-group-item bg-transparent ps-3 p-2 d-flex
                                    justify-content-start align-items-center"
                            key={item.id}>
                        <i className={`me-3 ${props.iconClassName}`}></i>

                        {/* Name */}
                        <div className="flex-fill fw-bold">{item.name}</div>

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
    } else {
        bodyContent = (
            <div className="d-flex justify-content-center align-items-center p-3">
                <span className="opacity-50">Không có {resourceDisplayName}</span>
            </div>
        );
    }

    return (
        <MainBlock title={resourceDisplayName.toUpperCase()} header={header} bodyPadding="0">
            {bodyContent}
        </MainBlock>
    );
};

interface Props {
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
}

const ProductCategoryList = ({ isInitialLoading, onInitialLoadingFinished }: Props) => {
    const service = useMemo(() => useProductCategoryService(), []);

    return (
        <SecondaryList resourceType="category" iconClassName="bi bi-tag-fill"
                isInitialLoading={isInitialLoading}
                onInitialLoadingFinished={onInitialLoadingFinished}
                initializeModel={requestDto => new ProductCategoryListModel(requestDto)}
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

const BrandList = ({ isInitialLoading, onInitialLoadingFinished }: Props) => {
    const service = useMemo(() => useBrandService(), []);

    return (
        <SecondaryList resourceType="brand" iconClassName="bi bi-building"
                isInitialLoading={isInitialLoading}
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