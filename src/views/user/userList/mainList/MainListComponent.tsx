import React, { useState, useEffect, useTransition, useRef } from "react";
import { UserListModel } from "@/models/user/userListModel";
import { useUserService } from "@/services/userService";
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
    const [isReloading, startReloadingTransition] = useTransition();
    const requestId = useRef<number>(1);
    const requestIdQueue = useRef<number[]>([]);

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
        startReloadingTransition(async () => {
            const currentRequestId = requestId.current;
            try {
                requestIdQueue.current.push(currentRequestId);
                requestId.current += 1;
                const responseDto = await userService.getListAsync(model.toRequestDto());
                const lastIndexInQueue = requestIdQueue.current.length - 1;
                if (requestIdQueue.current[lastIndexInQueue] === currentRequestId) {
                    setModel(model => model.fromListResponseDto(responseDto));
                    document.getElementById("content")
                        ?.scrollTo({ top: 0, behavior: "smooth" });
                }
            } catch (error) {
                const lastIndexInQueue = requestIdQueue.current.length - 1;
                if (requestIdQueue.current[lastIndexInQueue] === currentRequestId) {
                    if (error instanceof ValidationError) {
                        await getUndefinedErrorConfirmationAsync();
                        window.location.reload();
                        return;
                    }

                    throw error;
                }
            } finally {
                requestIdQueue.current = requestIdQueue.current
                    .filter(id => id != currentRequestId);
            }
        });
    };

    return (
        <div className="row g-3">
            {/* List filters */}
            <div className="col col-12">
                <Filters
                    isReloading={isReloading}
                    model={model}
                    onChanged={(changedData) => {
                        setModel(model => model.from(changedData));
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