import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserListModel } from "@/models/user/userListModel";
import { useUserService } from "@/services/userService";
import { useModelState } from "@/hooks/modelStateHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { ValidationError } from "@/errors";

// Layout components.
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Child components
import Filters from "./FiltersComponent";
import Results from "./ResultsComponent";

// Dependencies.
const userService = useUserService();

interface MainListProps {
    isInitialLoading: boolean;
    onInitialLoadingFinished: () => void;
}

// Component.
const MainList = ({ isInitialLoading, onInitialLoadingFinished }: MainListProps) => {
    // Dependencies.
    const initialData = useInitialDataStore(store => store.data);
    const navigate = useNavigate();

    // Model.
    const [model, setModel] = useState<UserListModel>(() => {
        return new UserListModel(initialData.user, initialData.role.allAsOptions);
    });
    const [isReloading, setReloading] = useState<boolean>(false);
    const modelState = useModelState();

    const loadAsync = useCallback(async (): Promise<void> => {
        modelState.resetErrors();
        if (!isInitialLoading) {
            setReloading(true);
        }

        try {
            const responseDto = await userService.getListAsync(model.toRequestDto());
            setModel(model => model.fromListResponseDto(responseDto));
        } catch (error) {
            if (error instanceof ValidationError) {
                modelState.setErrors(error.errors);
                if (isInitialLoading) {
                    await navigate(-1);
                }

                return;
            }

            throw error;
        } finally {
            if (isInitialLoading) {
                onInitialLoadingFinished();
            }

            setReloading(false);
        }
    }, [model]);

    const onPaginationPageButtonClicked = async (page: number): Promise<void> => {
        setModel(model => model.from({ page }));
    };

    // Effect.
    useEffect(() => {
        loadAsync().then();
    }, [model.page]);

    return (
        <div className="row g-3">
            {/* List filters */}
            <div className="col col-12">
                <Filters model={model} setModel={setModel} modelState={modelState}
                        isInitialLoading={isInitialLoading} isReloading={isReloading}
                        onSearchButtonClicked={loadAsync}/>
            </div>

            {/* List items */}
            <Results model={model.items} isReloading={isReloading} />

            {/* Pagination */}
            {model.pageCount > 1 && (
                <div className="col col-12 d-flex flex-row justify-content-center mb-5">
                    <MainPaginator page={model.page} pageCount={model.pageCount}
                            isReloading={isReloading}
                            onClick={onPaginationPageButtonClicked}/>
                </div>
            )}
        </div>
    );
};

export default MainList;