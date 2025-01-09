import { AbstractClonableModel } from "@models/baseModels";
import { useDateTimeUtility } from "@/utilities/dateTimeUtility";

const dateTimeUtility = useDateTimeUtility();

export class DateInputModel extends AbstractClonableModel<DateInputModel> {
    public readonly date: string = "";

    public get displayText(): string | null {
        const isoDate = this.isoDate;
        return isoDate && dateTimeUtility.getDisplayDateString(isoDate);
    }

    protected get isoDate(): string | null {
        return this.date ? dateTimeUtility.getDateTimeISOString(this.date) : null;
    }

    public fromResponseDto(value: string | null): DateInputModel {
        return this.from({
            date: value ? dateTimeUtility.getHTMLDateInputString(value) : ""
        });
    }

    public toRequestDto() {
        return this.date ? dateTimeUtility.getDateISOString(this.date) : null;
    }
}