import React, { useState, useEffect } from "react";
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
    const [forceUpdate, setForceUpdate] = useState<number>(() => 0);
    const modelState = useModelState();

    const onPaginationPageButtonClicked = async (page: number): Promise<void> => {
        setModel(model => model.from({ page }));
    };

    // Callbacks.
    const loadAsync = async (): Promise<void> => {
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
    };

    // Effect.
    useEffect(() => {
        loadAsync();
    }, [model.sortingByField, model.sortingByAscending, model.roleId, model.page, forceUpdate]);

    return (
        <div className="row g-3">
            {/* List filters */}
            <div className="col col-12">
                <Filters
                    model={model}
                    onChanged={(changedData) => {
                        setModel(model => model.from(changedData));
                    }}
                    modelState={modelState}
                    isInitialLoading={isInitialLoading}
                    isReloading={isReloading}
                    onSearchButtonClicked={(searchContent) => {
                        setModel(model => model.from({
                            content: searchContent,
                            page: 1
                        }));
                        setForceUpdate(forceUpdate => forceUpdate + 1);
                    }}
                />
            </div>

            {/* List items */}
            <Results model={model.items} isReloading={isReloading} />

            {/* Pagination */}
            {model.pageCount > 1 && (
                <div className="col col-12 d-flex flex-row justify-content-center mb-5">
                    <MainPaginator
                        page={model.page}
                        pageCount={model.pageCount}
                        isReloading={isReloading}
                        onClick={onPaginationPageButtonClicked}
                    />
                </div>
            )}
        </div>
    );
};

export default MainList;