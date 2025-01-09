import React, { useState, useEffect } from "react";
import { useViewStates } from "@/hooks/viewStatesHook";

// Layout components.
import MainContainer from "@layouts/MainContainerComponent";

// Child components.
import MainList from "./mainList/MainListComponent";
import SecondaryList from "./secondaryList/SecondaryListComponent";

const UserListView = () => {
    // States.
    const { isInitialLoading, onInitialLoadingFinished } = useViewStates();
    const [initialLoadingState, setInitialLoadingState] = useState(() => ({
        mainList: true,
        joinedRecentlyList: true,
        upcomingBirthdayList: true
    }));

    // Effect.
    useEffect(() => {
        const { mainList, joinedRecentlyList, upcomingBirthdayList } = initialLoadingState;

        if (!mainList && !joinedRecentlyList && !upcomingBirthdayList) {
            onInitialLoadingFinished();
        }
    }, [initialLoadingState]);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-0">
                <div className="col col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                    <MainList isInitialLoading={initialLoadingState.mainList}
                            onInitialLoadingFinished={() => {
                                setInitialLoadingState(state => ({
                                    ...state, mainList: false
                                }));
                    }} />
                </div>

                {/* Secondary lists */}
                <div className="col col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="row g-3">
                        <div className="col col-xl-12 col-lg-6 col-md-6 col-12">
                            <SecondaryList mode="JoinedRecently"
                                    isInitialLoading={initialLoadingState.joinedRecentlyList}
                                    onInitialLoadingFinished={() => {
                                        setInitialLoadingState(state => ({
                                            ...state,
                                            joinedRecentlyList: false
                                        }));
                                    }} />
                        </div>
                        <div className="col col-xl-12 col-lg-6 col-md-6 col-12">
                            <SecondaryList mode="UpcomingBirthday"
                                    isInitialLoading={initialLoadingState.upcomingBirthdayList}
                                    onInitialLoadingFinished={() => {
                                        setInitialLoadingState(state => ({
                                            ...state,
                                            upcomingBirthdayList: false
                                        }));
                                    }} />
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default UserListView;