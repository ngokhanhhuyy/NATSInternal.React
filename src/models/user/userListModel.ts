import { AbstractClonableModel } from "../baseModels";
import { UserBasicModel } from "./userBasicModel";
import type { UserBasicAuthorizationModel } from "@models/user/userBasicAuthorizationModel";
import { RoleMinimalModel } from "../role/roleMinimalModel";
import { ListSortingOptionsModel } from "../list/listSortingOptionsModel";
import { useRouteGenerator } from "@/router/routeGenerator";

const routeGenerator = useRouteGenerator();

type InitialResponseDto = ResponseDtos.User.Initial;
type RequestDto = RequestDtos.User.List;

export class UserListModel
        extends AbstractClonableModel<UserListModel>
        implements
            IUpsertableListModel<UserBasicModel, UserBasicAuthorizationModel>,
            ISortableListModel<UserBasicModel> {
    public readonly sortingByAscending: boolean | undefined;
    public readonly sortingByField: string | undefined;
    public readonly roleId: number | undefined;
    public readonly joinedRecentlyOnly: boolean | undefined;
    public readonly upcomingBirthdayOnly: boolean | undefined;
    public readonly resultsPerPage: number = 12;
    public readonly content: string = "";
    public readonly page: number = 1;
    public readonly items: UserBasicModel[] = [];
    public readonly pageCount: number = 0;
    public readonly sortingOptions: ListSortingOptionsModel | undefined;
    public readonly roleOptions: RoleMinimalModel[] | undefined;
    public readonly canCreate: boolean | undefined;
    public readonly createRoute: string = routeGenerator.getUserCreateRoutePath();

    constructor(
            listResponseDto: ResponseDtos.User.List,
            initialResponseDto?: InitialResponseDto,
            roleOptionsResponseDto?: ResponseDtos.Role.Minimal[],
            requestDto?: RequestDto) {
        super();

        this.pageCount = listResponseDto.pageCount;
        this.items = listResponseDto.items?.map(dto => new UserBasicModel(dto)) ?? [];
        
        if (initialResponseDto) {
            const sortingOptions = initialResponseDto.listSortingOptions;
            this.sortingOptions = new ListSortingOptionsModel(sortingOptions);
            this.sortingByField = this.sortingOptions.defaultFieldName;
            this.sortingByAscending = this.sortingOptions.defaultAscending;
            this.canCreate = initialResponseDto.creatingPermission;
        }

        if (roleOptionsResponseDto) {
            this.roleOptions = roleOptionsResponseDto.map(dto => new RoleMinimalModel(dto));
        }

        if (requestDto) {
            this.sortingByAscending = requestDto.sortingByAscending;
            this.sortingByField = requestDto.sortingByField;
            this.roleId = requestDto.roleId;
            this.joinedRecentlyOnly = requestDto.joinedRecentlyOnly;
            this.upcomingBirthdayOnly = requestDto.upcomingBirthdayOnly;
            this.resultsPerPage = requestDto.resultsPerPage ?? this.resultsPerPage;
            this.content = requestDto.content ?? this.content;
            this.page = requestDto.page ?? this.page;
        }
    }

    public fromListResponseDto(responseDto: ResponseDtos.User.List): UserListModel {
        return this.from({
            items: responseDto.items?.map(dto => new UserBasicModel(dto)) || [],
            pageCount: responseDto.pageCount
        });
    }

    public toRequestDto(): RequestDtos.User.List {
        return {
            sortingByAscending: this.sortingByAscending,
            sortingByField: this.sortingByField,
            page: this.page,
            resultsPerPage: this.resultsPerPage,
            content: this.content || undefined,
            roleId: this.roleId,
            joinedRecentlyOnly: this.joinedRecentlyOnly,
            upcomingBirthdayOnly: this.upcomingBirthdayOnly
        };
    }
}