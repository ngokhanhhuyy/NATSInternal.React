declare global {
    namespace ResponseDtos.List {
        type MonthYear = {
            month: number;
            year: number;
        }

        type MonthYearOptions = {
            options: MonthYear[];
            default: MonthYear;
        }
    }
}

export { };