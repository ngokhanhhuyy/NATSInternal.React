import { AbstractClonableModel } from "../baseModels";
import { MonthlyStatsDetailModel } from "@/models/stats/monthlyStatsDetailModel";
import { useDateTimeUtility } from "@/utilities/dateTimeUtility";

const dateTimeUtility = useDateTimeUtility();

export class MonthlyReportModel extends AbstractClonableModel<MonthlyReportModel> {
    public readonly stats: MonthlyStatsDetailModel | null = null;
    public readonly recordedYear: number = 0;
    public readonly recordedMonth: number = 0;
    public readonly dateOptions: [number, number, number][] = [];
    public readonly yearOptions: number[] = [];
    public readonly monthOptions: number[] = [];

    public fromMonthlyDetail(
            responseDto: ResponseDtos.Stats.MonthlyDetail): MonthlyReportModel {
        return this.from({ stats: new MonthlyStatsDetailModel(responseDto) });
    }

    public fromRecordedYear(recordedYear: number): MonthlyReportModel {
        const monthOptions = MonthlyReportModel.computeMonthOptions(
            this.dateOptions,
            recordedYear);
        const maxMonth = Math.max(...monthOptions);
        const minMonth = Math.min(...monthOptions);
        let recordedMonth = this.recordedMonth;
        if (recordedMonth > maxMonth) {
            recordedMonth = maxMonth;
        }

        if (recordedMonth < minMonth) {
            recordedMonth = minMonth;
        }

        return this.from({
            recordedYear,
            recordedMonth,
            monthOptions,
        });
    }

    public fromRecordedMonth(recordedMonth: number): MonthlyReportModel {
        return this.from({ recordedMonth });
    }

    public fromRecordedDate(year: number, month: number): MonthlyReportModel {
        return this.from({
            recordedYear: year,
            recordedMonth: month,
        });
    }

    public fromDateOptions(responseDtos: string[]): MonthlyReportModel {
        const dateOptions = responseDtos.map(dateAsString => {
            return dateTimeUtility.getDateFromISOString(dateAsString);
        });

        const [lastYear, lastMonth, _] = dateOptions[dateOptions.length - 1];

        return this.from({
            recordedYear: lastYear,
            recordedMonth: lastMonth,
            yearOptions: MonthlyReportModel.computeYearOptions(dateOptions),
            monthOptions: MonthlyReportModel.computeMonthOptions(dateOptions, lastYear),
            dateOptions
        });
    }

    public toRequestDto(): RequestDtos.Stats.Monthly {
        return {
            recordedYear: this.recordedYear,
            recordedMonth: this.recordedMonth
        };
    }

    private static computeYearOptions(dateOptions: [number, number, number][]): number[] {
        const options: number[] = [];
        for (const [year, _, __] of dateOptions) {
            if (!options.includes(year)) {
                options.push(year);
            }
        }

        return options;
    }

    private static computeMonthOptions(
            dateOptions: [number, number, number][],
            recordedYear: number): number[] {
        const options: number[] = [];
        for (const [year, month, _] of dateOptions) {
            if (year > recordedYear) {
                break;
            }

            if (year === recordedYear && !options.includes(month)) {
                options.push(month);
            }
        }

        console.log(options);

        return options;
    }
}