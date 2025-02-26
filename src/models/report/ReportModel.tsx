import { AbstractClonableModel } from "../baseModels";
import { MonthlyStatsDetailModel } from "@/models/stats/monthlyStatsDetailModel";
import { useDateTimeUtility } from "@/utilities/dateTimeUtility";

const dateTimeUtility = useDateTimeUtility();

export class MonthlyReportModel extends AbstractClonableModel<MonthlyReportModel> {
    public readonly stats: MonthlyStatsDetailModel | null = null;
    public readonly recordedMonthYear: [number, number] = [0, 0];
    public readonly monthYearOptions: [number, number][] = [];

    public fromMonthlyDetail(
            responseDto: ResponseDtos.Stats.MonthlyDetail): MonthlyReportModel {
        return this.from({ stats: new MonthlyStatsDetailModel(responseDto) });
    }

    public fromDateOptions(responseDtos: string[]): MonthlyReportModel {
        const dateOptions = responseDtos
            .map(dateAsString => {
                return dateTimeUtility.getDateFromISOString(dateAsString);
            }).reverse();

        const monthYearOptions: [number, number][] = [];
        for (const [year, month, _] of dateOptions) {
            const isAdded = !!monthYearOptions.find(([addedYear, addedMonth]) => {
                return addedYear === year && addedMonth === month;
            });
            if (!isAdded) {
                monthYearOptions.push([year, month]);
            }
        }

        return this.from({
            monthYearOptions,
            recordedMonthYear: monthYearOptions[0]
        });
    }

    public toRequestDto(): RequestDtos.Stats.Monthly {
        const [recordedYear, recordedMonth] = this.recordedMonthYear;
        return {
            recordedYear,
            recordedMonth
        };
    }
}