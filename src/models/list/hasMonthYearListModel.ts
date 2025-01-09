import { useState } from "react";
import { type ListMonthYearModel } from "./listMonthYearModel";
import {
    useListMonthYearOptionsModel,
    type ListMonthYearOptionsModel } from "./listMonthYearOptionsModel";

export type HasMonthYearListModel = {
    monthYear: ListMonthYearModel | undefined;
    setMonthYear: ModelPropertySetter<ListMonthYearModel | undefined>;
    monthYearOptions: ListMonthYearOptionsModel | undefined;
}

export function useHasMonthYearListModel(responseDto: ResponseDtos.List.MonthYearOptions):
        HasMonthYearListModel {
    const [monthYear, setMonthYear] = useState<ListMonthYearModel>();
    const monthYearOptions = useListMonthYearOptionsModel(responseDto);

    return {
        monthYear,
        setMonthYear,
        monthYearOptions
    };
}