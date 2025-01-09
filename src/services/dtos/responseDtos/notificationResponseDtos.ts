declare global {
    namespace ResponseDtos.Notification {
        type Single = Implements<IBasic, {
            id: number;
            type: import("@enums").NotificationType;
            dateTime: string;
            resourceIds: number[] | null;
            createdUser: ResponseDtos.User.Basic | null;
            isRead: boolean;
        }>;
        
        type List = Implements<IList<Single>, {
            pageCount: number;
            items: Single[];
        }>;
    }
}

export { };