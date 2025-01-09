const utility = {
    getDisplayText(amount: number) {
        return amount.toLocaleString("vi").replaceAll(".", " ") + " vnđ";
    }
};
/**
 * A utility to convert a number as amount into a formated string for displaying.
 *
 * @returns An object containing the method for converting.
 */
export function useAmountUtility() {
    return utility;
}