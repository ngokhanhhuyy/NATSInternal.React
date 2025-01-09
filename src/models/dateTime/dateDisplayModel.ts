import { useDateTimeUtility } from "@/utilities/dateTimeUtility";

const dateTimeUtility = useDateTimeUtility();

export class DateDisplayModel {
    public readonly date: string;

    constructor(date: string) {
        this.date = dateTimeUtility.getDisplayDateString(date);
    }

    public toString(): string {
        return this.date;
    }
}