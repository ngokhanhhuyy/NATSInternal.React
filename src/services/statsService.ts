import { useApiClient } from "./apiClient";

type TopPurchasedCustomerListRequestDto = RequestDtos.Stats.TopPurchasedCustomerList;
type TopPurchasedCustomerListResponseDto = ResponseDtos.Stats.TopPurchasedCustomerList;
type StatsRangeTypeOptionListResponseDto = ResponseDtos.Stats.RangeTypeOptionList;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves daily stats with details by a given recorded date. If the date is not
     * specified, the returned stats will be today stats.
     * @param recorededDate The date when the daily stats was recorded.
     * @returns A {@link Promise} representing the asynchonous operation, which result is a DTO
     * object containing the detail information of the daily stats.
     * 
     * @throws {ValidationError} Throws when the value for `recordedDate` is invalid.
     * @throws {NotFoundError} Thrown when the stats recorded at the specified date doesn't
     * exist.
     */
    async getDailyDetailAsync(recorededDate: string): Promise<ResponseDtos.Stats.DailyDetail> {
        return await apiClient.getAsync("/stats/daily", { recorededDate });
    },

    /**
     * Retrieves the stats of lastest dates with basic information, specified by the count of
     * dates, from today (if the `requestDto` specifies) or yesterday to the past.
     * 
     * @param requestDto A DTO indicating the count number of dates and whether today's data
     * should be included.
     * @returns A {@link Promise} representing the asynchonous operation, which result is a DTO
     * containing the basic information of the dates' stats.
     * 
     * @throws {ValidationError} Throws when the conditions specified in the request DTO is
     * invalid.
     */
    async getLastestDailyBasicAsync(requestDto: RequestDtos.Stats.LastestDaily):
            Promise<ResponseDtos.Stats.DailyBasic[]> {
        return await apiClient.getAsync("/stats/lastestDailyBasic", requestDto);
    },

    /**
     * Retrieves the stats of lastest dates with details, specified by the count of dates, from
     * today (if the `requestDto` specifies) or yesterday to the past.
     * 
     * @param requestDto A DTO indicating the count number of dates and whether today's data
     * should be included.
     * @returns A {@link Promise} representing the asynchonous operation, which result is a DTO
     * containing the basic information of the dates' stats.
     * 
     * @throws {ValidationError} Throws when the conditions specified in the request DTO is
     * invalid.
     */
    async getLastestDailyDetailAsync(requestDto: RequestDtos.Stats.LastestDaily):
            Promise<ResponseDtos.Stats.DailyDetail[]> {
        return await apiClient.getAsync("/stats/lastestDailyDetail", requestDto);
    },

    /**
     * Retrieves monthly stats with details by a given recorded month and year. If the date is
     * not specified, the returned stats will be this month stats.
     * 
     * @param requestDto A DTO object containing expected recorded year and month when the
     * monthly stats was recorded.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * DTO object containing the detail information of the monthly stats.
     * 
     * @throws {ValidationError} Throws when the conditions specified in the request DTO is
     * invalid.
     * @throws {NotFoundError} Thrown when the stats recorded at the specified month and year
     * doesn't exist.
     */
    async getMonthlyDetailAsync(requestDto: RequestDtos.Stats.Monthly):
            Promise<ResponseDtos.Stats.MonthlyDetail> {
        return await apiClient.getAsync("/stats/monthly", requestDto);
    },

    /**
     * Retrieves the stats of lastest months with basic information, specified by the count of
     * months, from this month (if the `requestDto` specifies), to the past.
     * 
     * @param requestDto A DTO instance indicating the count number of months and whethere the
     * this month data should be included.
     * @returns A {@link Promise} representing the asynchonous operation, which result is a DTO
     * containing the basic information of the months' stats.
     * 
     * @throws {ValidationError} Throws when the conditions specified in the request DTO is
     * invalid.
     */
    async getLastestMonthlyAsync(requestDto: RequestDtos.Stats.LastestMonthly):
            Promise<ResponseDtos.Stats.MonthlyBasic[]> {
        return await apiClient.getAsync("/stats/lastestMonthly", requestDto);
    },

    /**
     * Retrieves the top of the sold products with basic information, based on the creteria
     * and count in a lastest time-range specified in the request DTO.
     * 
     * @param requestDto A DTO instance containing the conditions for the results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * DTO containing the results and range information.
     * @example getTopSoldProductListAsync();
     * @example getTopSoldProductListAsync({
     *  rangeType: "Date",
     *  rangeLength: 1,
     *  includeTodayOrThisMonth: true,
     *  creteria: "Amount",
     *  count: 5
     * });
     * 
     * @throws {ValidationError} Throws when the conditions specified in the request DTO is
     * invalid.
     */
    async getTopSoldProductListAsync(requestDto?: RequestDtos.Stats.TopSoldProductList):
            Promise<ResponseDtos.Stats.TopSoldProductList> {
        return await apiClient.getAsync("/stats/topSoldProductList", requestDto);
    },

    /**
     * Retrieves the range type options which can be used as conditions for top sold product
     * retrieving operation.
     * 
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing an array of options with display names and the default option if the
     * request DTO for the operation doesn't include one.
     * @example getTopProductRangeTypeOptionsAsync();
     */
    async getTopProductRangeTypeOptionsAsync(): Promise<StatsRangeTypeOptionListResponseDto> {
        return await apiClient.getAsync("/stats/");
    },

    /**
     * Retrieves the top of the purchased customers with basic information, based on the
     * creteria and count in a lastest time-range specified in the request DTO.
     * 
     * @param requestDto A DTO instance containing the conditions for the results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * DTO containing the results and range information.
     * @example getTopPurchasedCustomerListAsync();
     * @example getTopPurchasedCustomerListAsync({
     *  rangeType: "Date",
     *  rangeLength: 1,
     *  includeTodayOrThisMonth: true,
     *  creteria: "Amount",
     *  count: 5
     * });
     * 
     * @throws {ValidationError} Throws when the conditions specified in the request DTO is
     * invalid.
     */
    async getTopPurchasedCustomerListAsync(requestDto?: TopPurchasedCustomerListRequestDto):
            Promise<TopPurchasedCustomerListResponseDto> {
        return await apiClient.getAsync("/stats/topPurchasedCustomerList", requestDto);
    },

    /**
     * Retrieves the lastest transactions, based on the transaction count specified in the
     * request DTO.
     * 
     * @param requestDto A DTO containing the conditions for the results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a an
     * array of DTOs, containing the results.
     * @example getLastestTransactionsAsync();
     * @example getLastestTransactionsAsync({
     *  count: 5
     * });
     * 
     * @throws {ValidationError} Throws when the conditions specified in the request DTO is
     * invalid.
     */
    async getLastestTransactionsAsync(requestDto?: RequestDtos.Stats.LastestTransactions):
            Promise<ResponseDtos.Stats.LastestTransaction[]> {
        return await apiClient.getAsync("/stats/lastestTransactions", requestDto);
    }
};

/**
 * A service to send requests and handle responses representing the stats related operations.
 *
 * @returns An object containing the methods which perform the operations.
 */
export function useStatsService() {
    return service;
}