import { AbstractClonableModel } from "@models/baseModels";
import { useDateTimeUtility } from "@/utilities/dateTimeUtility";

const dateTimeUtility = useDateTimeUtility();

export class DateTimeInputModel extends AbstractClonableModel<DateTimeInputModel> {
    public readonly dateTime: string = "";

    public get displayText(): string | null {
        const isoDateTime = this.isoDateTime;
        return isoDateTime && dateTimeUtility.getDisplayDateTimeString(isoDateTime);
    }

    public get dateDisplayText(): string | null {
        const isoDateTime = this.isoDateTime;
        return isoDateTime && dateTimeUtility.getDisplayDateString(isoDateTime);
    }

    public get timeDisplayText(): string | null {
        const isoDateTime = this.isoDateTime;
        return isoDateTime && dateTimeUtility.getDisplayTimeString(isoDateTime);
    }

    protected get isoDateTime(): string | null {
        return this.dateTime ? dateTimeUtility.getDateTimeISOString(this.dateTime) : null;
    }

    public fromResponseDto(responseDto: string | null): DateTimeInputModel {
        let dateTime = "";
        if (responseDto) {
            dateTime = dateTimeUtility.getHTMLDateTimeInputString(responseDto);
        }

        return this.from({ dateTime });
    }

    public toRequestDto(): string | null {
        return this.isoDateTime;
    }
}