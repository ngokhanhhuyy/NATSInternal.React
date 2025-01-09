import { AbstractClonableModel } from "@models/baseModels";
import { useDateTimeUtility } from "@/utilities/dateTimeUtility";

const dateTimeUtility = useDateTimeUtility();

export class StatsDateTimeInputModel extends AbstractClonableModel<StatsDateTimeInputModel> {
    public readonly dateTime: string = "";
    public readonly isSpecified: boolean = false;
    public readonly isForCreating: boolean = true;
    public readonly initialDateTime: string = "Hiện tại";

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
        return this.dateTime && dateTimeUtility.getDateTimeISOString(this.dateTime);
    }

    public fromDateTimeResponseDto(responseDto: string): StatsDateTimeInputModel {
        const dateTime = dateTimeUtility.getHTMLDateTimeInputString(responseDto);
        return this.from({
            dateTime,
            initialDateTime: dateTimeUtility.getDisplayDateTimeString(responseDto),
            isForCreating: false,
        });
    }

    public toRequestDto(): string | null {
        if (!this.isSpecified) {
            return null;
        }

        return this.isoDateTime;
    }
}