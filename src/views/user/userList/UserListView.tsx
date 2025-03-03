import { useViewStates } from "@/hooks/viewStatesHook";
import { useAsyncModelInitializer } from "@/hooks/asyncModelInitializerHook";
import { useInitialDataStore } from "@/stores/initialDataStore";
import { useUserService } from "@/services/userService";
import { UserListModel } from "@/models/user/userListModel";

// Layout components.
import MainContainer from "@layouts/MainContainerComponent";

// Child components.
import MainList from "./mainList/MainListComponent";
import SecondaryList from "./secondaryList/SecondaryListComponent";

const UserListView = () => {
    // Dependencies.
    const initialData = useInitialDataStore(store => store.data);
    const userService = useUserService();

    // States.
    const { isInitialRendering } = useViewStates();
    const initialModels = useAsyncModelInitializer({
        initializer: async () => {
            const joinedRecentlyListRequestDto = { joinedRecentlyOnly: true };
            const upcomingBirthdayListRequestDto = { upcomingBirthdayOnly: true };
            const [mainList, joinedRecentlyList, upcomingBirthdayList] = await Promise.all([
                userService.getListAsync(),
                userService.getListAsync(joinedRecentlyListRequestDto),
                userService.getListAsync(upcomingBirthdayListRequestDto)
            ]);
            const userInitialData = initialData.user;
            const roleOptions = initialData.role.allAsOptions;
            return {
                mainList: new UserListModel(mainList, userInitialData, roleOptions),
                joinedRecentlyList: new UserListModel(
                    joinedRecentlyList,
                    undefined,
                    undefined,
                    joinedRecentlyListRequestDto),
                upcomingBirthdayList: new UserListModel(
                    upcomingBirthdayList,
                    undefined,
                    undefined,
                    upcomingBirthdayListRequestDto)
            };
        },
        cacheKey: "userList"
    });

    return (
        <MainContainer>
            <div className="row g-0">
                <div className="col col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                    <MainList
                        isInitialRendering={isInitialRendering}
                        initialModel={initialModels.mainList}
                    />
                </div>

                {/* Secondary lists */}
                <div className="col col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="row g-3">
                        <div className="col col-xl-12 col-lg-6 col-md-6 col-12">
                            <SecondaryList
                                mode="JoinedRecently"
                                isInitialRendering={isInitialRendering}
                                initialModel={initialModels.joinedRecentlyList}
                            />
                        </div>
                        <div className="col col-xl-12 col-lg-6 col-md-6 col-12">
                            <SecondaryList
                                mode="UpcomingBirthday"
                                isInitialRendering={isInitialRendering}
                                initialModel={initialModels.upcomingBirthdayList}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
};

export default UserListView;