import React from "react";
import { UserDetailModel } from "@/models/user/userDetailModel";
import { useUserService } from "@/services/userService";
import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";

// Layout components.
import MainContainer from "@/views/layouts/MainContainerComponent";

// Child components.
import PersonalInformation from "./PersonalInformationComponent";
import UserInformation from "./UserInformationComponent";
import AvatarAndNames from "./AvatarAndNamesComponent";

// Component.
const UserProfileView = ({ id }: { id: number }) => {
    // Dependency.
    const userService = useUserService();

    // Model and states.
    useViewStates();
    const model = useAsyncModelInitializer({
        initializer: async () => {
            const responseDto = await userService.getDetailAsync(id);
            return new UserDetailModel(responseDto);
        },
        cacheKey: "userDetail"
    });

    return (
        <MainContainer>
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