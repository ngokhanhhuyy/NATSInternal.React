import { useDateTimeUtility } from "@/utilities/dateTimeUtility";

const dateTimeUtility = useDateTimeUtility();

export class DateTimeDisplayModel {
    public readonly date: string;
    public readonly time: string;
    public readonly dateTime: string;
    public readonly deltaText: string;

    constructor(dateTime: string) {
        this.date = dateTimeUtility.getDisplayDateString(dateTime);
        this.time = dateTimeUtility.getDisplayTimeString(dateTime);
        this.dateTime = dateTimeUtility.getDisplayDateTimeString(dateTime);
        this.deltaText = dateTimeUtility.getDeltaTextRelativeToNow(dateTime);
    }

    public toString() {
        return this.dateTime;
    }
}