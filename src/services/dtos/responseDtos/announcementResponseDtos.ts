declare global {
    namespace ResponseDtos.Announcement {
        type List = Implements<IUpsertableList<Basic, ExistingAuthorization>, {
            items: Basic[];
            pageCount: number;
        }>;
        
        type Basic = Implements<IUpsertableBasic<ExistingAuthorization>, {
            id: number;
            category: import("@enums").AnnouncementCategory;
            title: string;
            content: string;
            startingDateTime: string;
            endingDateTime: string;
            createdUser: ResponseDtos.User.Basic;
            authorization: ExistingAuthorization | null;
        }>;
    
        type ExistingAuthorization = Implements<IUpsertableExistingAuthorization, {
            canEdit: boolean;
            canDelete: boolean;
        }>;

        type Initial = Implements<IUpsertableInitial, {
            displayName: string;
            creatingPermission: boolean;
        }>;
    }
}

export { };