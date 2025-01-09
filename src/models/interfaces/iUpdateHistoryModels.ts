import type { UserBasicModel } from "../userModels";
import type { DateTimeDisplayModel } from "../dateTime/dateTimeDisplayModel";

declare global {
    interface IUpdateHistoryModel {
        readonly updatedDateTime: DateTimeDisplayModel
        readonly updatedUser: UserBasicModel
        readonly updatedReason: string | null;
    }
}

export { };