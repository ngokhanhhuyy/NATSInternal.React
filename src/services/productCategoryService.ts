import { useApiClient } from "./apiClient";

type ListRequestDto = RequestDtos.ProductCategory.List;
type ListResponseDto = ResponseDtos.ProductCategory.List;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of product categories, based on the paginating conditions.
     *
     * @param requestDto (Optional) An object containing the paginating conditions for the
     * results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results.
     * @example getListAsync();
     */
    async getListAsync(requestDto?: ListRequestDto) : Promise<ListResponseDto> {
        return await apiClient.getAsync("/productCategory", requestDto);
    },

    /**
     * Retrieves a list of all product categories, without pagination.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results.
     * @example getListAsync();
     */
    async getAllAsync(): Promise<ResponseDtos.ProductCategory.Minimal[]> {
        return await apiClient.getAsync("/productCategory/all");
    },

    /**
     * Retrieves the details of a specific product category, based on its id.
     *
     * @param id A {@link number} representing the id of the product category to retrieve.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the details of the product category.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the product category with the specified id doesn't
     * exist or has already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.ProductCategory.Detail> {
        return await apiClient.getAsync(`/productCategory/${id}`);
    },

    /**
     * Creates a new product category, based on the specified data.
     *
     * @param requestDto An object containing the data for the creating operation.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * {@link number} representing the id of the new product category.
     * @example createAsync(productRequestDtos.Category.Upsert);
     *
     * @throws {ValidationError} Throws when the data specified in the `requestDto`
     * argument is invalid.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during
     * the operation.
     * @throws {OperationError} Throws when the unique value for the `name` property in the
     * `requestDto` argument already exists.
     */
    async createAsync(requestDto: RequestDtos.ProductCategory.Upsert): Promise<number> {
        return await apiClient
            .postAsync<number>("/productCategory/create", requestDto);
    },

    /**
     * Updates an existing product category, based on its id and the specified data.
     *
     * @param id A {@link number} representing the id of the product category to update.
     * @param requestDto An object containing the data for the updating operation.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example updateAsync(1, productRequestDtos.Category.Upsert);
     *
     * @throws {ValidationError} Throws when the data specified in the `requestDto` argument is
     * invalid.
     * @throws {NotFoundError} Throws when the product category with the specified id doesn't
     * exist or has already been deleted.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the unique value for the `name` property in the
     * `requestDto` argument already exists.
     */
    async updateAsync(
        id: number,
        requestDto: RequestDtos.ProductCategory.Upsert): Promise<void> {
        return await apiClient
            .putAndIgnoreAsync(`/productCategory/${id}`, requestDto);
    },

    /**
     * Deletes an existing product category, based on its id.
     *
     * @param id A {@link number} representing the id of the product category to delete.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example deleteAsync(1);
     *
     * @throws {NotFoundError} Throws when the product category with the specified id doesn't
     * exist or has already been deleted.
     * @throws {ConcurrencyError} Throws when a concurrency-related conflict occurs during the
     * operation.
     * @throws {OperationError} Throws when the product category's deletion is restricted due
     * to the existence of some related data.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient
            .deleteAndIgnoreAsync(`/productCategory/${id}`);
    },

    /**
     * Check if the requesting user has permission to create a new product category.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/productCategory/creatingPermission");
    }
};

/**
 * A service to send requests and handle responses which are related to product categories.
 *
 * @returns An object containing the methods to perform the operations.
 */
export function useProductCategoryService() {
    return service;
}