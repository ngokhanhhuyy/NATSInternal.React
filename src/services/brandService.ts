import { useApiClient } from "./apiClient";

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of all brands with minimal information.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * array of objects containing the minimal information of the brands.
     * @example getAllAsync();
     */
    async getAllAsync(): Promise<ResponseDtos.Brand.Minimal[]> {
        return await apiClient.getAsync("/brand/all");
    },

    /**
     * Retrieves a list of brands based on the specified sorting and paginating conditions.
     *
     * @param requestDto An object containing the sorting and paginating conditions for the
     * results.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the results.
     * @example getListAsync();
     * @example getListAsync(brandListRequestDto);
     */
    async getListAsync(requestDto?: RequestDtos.Brand.List)
        : Promise<ResponseDtos.Brand.List> {
        return await apiClient.getAsync("/brand", requestDto);
    },

    /**
     * Retrieves the details of the brand with the specified id.
     * @param id A {@link number} representing the id of the brand to retrieve.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the details of the brand.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the brand with the specified id doesn't exist or
     * has already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.Brand.Detail> {
        return await apiClient.getAsync(`/brand/${id}`);
    },

    /**
     * Creates a new brand with the specified data.
     *
     * @param requestDto An object the data for the operation.
     * @returns A {@link Promise} representing the asynchronous operation, which result is a
     * {@link number} representing the id of the new brand.
     * @example
     * createAsync(brandUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the provided data is invalid.
     * @throws {OperationError} Throws when the country with the id specified by the value of
     * the property `country.id` in the argument for the `requestDto` parameter doesn't exist
     * or when the name specified by the value of the property `name` in the argument for the
     * `requestDto` parameter already exists.
     */
    async createAsync(requestDto: RequestDtos.Brand.Upsert): Promise<number> {
        return await apiClient.postAsync("/brand", requestDto);
    },

    /**
     * Updates an existing brand with the specified id.
     *
     * @param id A {@link number} representing the id of the brand to update.
     * @param requestDto An object containing the data for the brand to be updated.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example
     * updateAsync(1, brandUpsertRequestDto);
     *
     * @throws {ValidationError} Throws when the provided data is invalid.
     * @throws {NotFoundError} Throws when the brand with the specified id doesn't exist or has
     * already been deleted.
     * @throws {OperationError} Throws when the country with the id specified by the value of
     * the property `country.id` in the argument for the `requestDto` parameter doesn't exist
     * or when the name specified by the value of the property `name` in the argument for the
     * `requestDto` parameter already exists.
     */
    async updateAsync(
        id: number,
        requestDto: RequestDtos.Brand.Upsert): Promise<void> {
        return await apiClient.putAndIgnoreAsync(`/brand/${id}`, requestDto);
    },

    /**
     * Deletes an existing brand with the specified id.
     *
     * @param id A {@link number} representing the id of the brand to be deleted.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example
     * deleteAsync(1);
     *
     * @throws {NotFoundError} Throws when the brand with the specified id doesn't exist or has
     * already been deleted.
     */
    async deleteAsync(id: number): Promise<void> {
        return await apiClient.deleteAndIgnoreAsync(`/brand/${id}`);
    },

    /**
     * Check if the requesting user has permission to create a new brand.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/brand/creatingPermission");
    },
};

/**
 * A service to send requests and handle responses which represent the order-related
 * operations.
 *
 * @returns An object containing the methods which perform the operations.
 */
export function useBrandService() {
    return service;
}