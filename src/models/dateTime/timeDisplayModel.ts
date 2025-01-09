import { useDateTimeUtility } from "@/utilities/dateTimeUtility";

const dateTimeUtility = useDateTimeUtility();

type TimeDisplayModel = Readonly<{
    time: string;
    deltaText: string;
    toString(): string;
}>;

const createTimeDisplayModel = (time: string): TimeDisplayModel => ({
    time: dateTimeUtility.getDisplayTimeString(time),
    get deltaText(): string {
        return dateTimeUtility.getDeltaTextRelativeToNow(time);
    },
    toString(this: Readonly<IDateDisplayModel>) {
        return this.date;
    }
});

export { TimeDisplayModel, createTimeDisplayModel };