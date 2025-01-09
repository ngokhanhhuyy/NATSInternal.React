import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserDetailModel } from "@/models/user/userDetailModel";
import { useUserService } from "@/services/userService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAlertModalStore } from "@/stores/alertModalStore";
import { NotFoundError } from "@/errors";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child components.
import PersonalInformation from "./PersonalInformationComponent";
import UserInformation from "./UserInformationComponent";
import AvatarAndNames from "./AvatarAndNamesComponent";

// Component.
const UserProfileView = ({ id }: { id: number }) => {
    // Dependency.
    const userService = useMemo(() => useUserService(), []);
    const alertModalStore = useAlertModalStore();
    const navigate = useNavigate();

    // Model and states.
    const { isInitialLoading, onInitialLoadingFinished, routeGenerator } = useViewStates();
    const [model, setModel] = useState<UserDetailModel>();

    // Effect.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseDto = await userService.getDetailAsync(id);
                setModel(new UserDetailModel(responseDto));
            } catch (error) {
                if (error instanceof NotFoundError) {
                    await alertModalStore.getNotFoundConfirmationAsync();
                    await navigate(routeGenerator.getUserListRoutePath());
                    return;
                }
                
                throw error;
            }
        };

        fetchData().then(() => onInitialLoadingFinished());
    }, []);

    return (
        <MainContainer isInitialLoading={isInitialLoading}>
            <div className="row g-3 position-relative">
                {/* Avatar and names */}
                {(!model || model.personalInformation) && (
                    <div className="col col-12">
                        <AvatarAndNames model={model} />
                    </div>
                )}

                {/* Personal information */}
                {(!model || model.personalInformation) && (
                    <div className="col col-md-6 col-sm-12 col-12">
                        <PersonalInformation model={model?.personalInformation ?? null} />
                    </div>
                )}


                {/* User information */}
                {(!model || model.userInformation) && (
                    <div className="col col-md-6 col-sm-12 col-12">
                        <UserInformation userInformation={model?.userInformation}
                                authorization={model?.authorization} />
                    </div>
                )}
            </div>
        </MainContainer>
    );
};

export default UserProfileView;