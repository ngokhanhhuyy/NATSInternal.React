import React, { useState, useEffect, startTransition } from "react";
import { UserListModel } from "@/models/user/userListModel";
import { useUserService } from "@/services/userService";
import { useModelState } from "@/hooks/modelStateHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { ValidationError } from "@/errors";

// Layout components.
import MainPaginator from "@/views/layouts/MainPaginatorComponent";

// Child components
import Filters from "./FiltersComponent";
import Results from "./ResultsComponent";

// Dependencies.
const userService = useUserService();

interface MainListProps {
    initialModel: UserListModel;
    isInitialRendering: boolean;
}

// Component.
const MainList = (props: MainListProps) => {
    // Dependencies.
    const getUndefinedErrorConfirmationAsync = useAlertModalStore(store => {
        return store.getUndefinedErrorConfirmationAsync;
    });

    // Model.
    const [model, setModel] = useState<UserListModel>(() => props.initialModel);
    const [isReloading, setReloading] = useState<boolean>(false);
    const modelState = useModelState();

    const onPaginationPageButtonClicked = async (page: number): Promise<void> => {
        setModel(model => model.from({ page }));
    };

    // Effect.
    useEffect(() => {
        if (!props.isInitialRendering) {
            reloadAsync();
        }
    }, [
        model.sortingByField,
        model.sortingByAscending,
        model.roleId,
        model.page,
        model.content
    ]);

    // Callbacks.
    const reloadAsync = async (): Promise<void> => {
        modelState.resetErrors();
        setReloading(true);

        startTransition(async () => {
            try {
                const responseDto = await userService.getListAsync(model.toRequestDto());
                setModel(model => model.fromListResponseDto(responseDto));
            } catch (error) {
                if (error instanceof ValidationError) {
                    await getUndefinedErrorConfirmationAsync();
                    window.location.reload();
                    return;
                }
    
                throw error;
            } finally {
                setReloading(false);
            }
        });
    };

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
                    isReloading={isReloading}
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