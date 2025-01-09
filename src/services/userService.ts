import { useApiClient } from "./apiClient";

type PasswordResetRequestDto = RequestDtos.User.PasswordReset;

const apiClient = useApiClient();
const service = {
    /**
     * Retrieves a list of users with the basic information, based on the specified filtering,
     * sorting and paginating conditions.
     *
     * @param requestDto (Optional) An object containing the conditions for the results.
     * @returns An object containing the results and the additional information for pagination.
     * @example getListAsync();
     * @example getListAsync(userListRequestDto);
     *
     * @throws {ValidationError} Throws when the conditions specified in the `requestDto`
     * parameter is invalid.
     */
    async getListAsync(requestDto?: RequestDtos.User.List): Promise<ResponseDtos.User.List> {
        return await apiClient.getAsync("/user", requestDto);
    },

    /**
     * Retrieves the details of a specific user, specified by the id of the user.
     *
     * @param id The id of the target user.
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the details of the target user.
     * @example getDetailAsync(1);
     *
     * @throws {NotFoundError} Throws when the user with the specified id doesn't exist or has
     * already been deleted.
     */
    async getDetailAsync(id: number): Promise<ResponseDtos.User.Detail> {
        return await apiClient.getAsync(`/user/${id}`);
    },

    /**
     * Retrieves the details of the requesting user.
     *
     * @returns A {@link Promise} representing the asynchronous operation, which result is an
     * object containing the details of the requesting user.
     * @example getCallerDetailAsync();
     */
    async getCallerDetailAsync(): Promise<ResponseDtos.User.Detail> {
        return await apiClient.getAsync(`/user/caller`);
    },

    /**
     * Creates a new user, based on the specified data.
     *
     * @param requestDto An object containing the data for the new user.
     * @returns A {@link Promise} representing the asynchronous operation, which result is the
     * id of the new user.
     * @example createUserAsync(userCreateRequestDto);
     *
     * @throws {ValidationError} Throws when the data specified in the argument for the
     * `requestDto` parameter is invalid.
     * @throws {DuplicatedError} Throws when the value of the property `userName`, specified in
     * the argument for the `requestDto` parameter already exists.
     * @throws {NotFoundError} Throws when the role which has the name specified by the value
     * of the property `userInformation.role.name` in the argument for the `requestDto`
     * parameter doesn't exist.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to create a new user.
     * @throws {OperationError} Throws when a business logic validation occurs during the
     * assignment of the new user to the specified role.
     */
    async createAsync(requestDto: RequestDtos.User.Create): Promise<number> {
        return await apiClient.postAsync("/user", requestDto);
    },

    /**
     * Updates an existing user, specified by the id of the user.
     *
     * @param id The id of the target user.
     * @param requestDto An object containing the data for the updating operation.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example updateUserAsync(1, userUpdateRequestDto);
     *
     * @throws {ValidationError} Throws when the data specified in the argument for the
     * `requestDto` parameter is invalid.
     * @throws {NotFoundError} Throws when the user with the specified id doesn't exist or has
     * already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to update the target user.
     */
    async updateAsync(id: number, requestDto: RequestDtos.User.Update): Promise<void> {
        await apiClient.putAndIgnoreAsync(`/user/${id}`, requestDto);
    },

    /**
     * Changes the password of the current user.
     *
     * @param requestDto An object containing the current password, the new password and
     * the confirmation password for the operation.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @remarks The requesting user and the user whose id specified by the value of the `id`
     * argument must be the same one, since a user can only change his/her password by
     * himself/herself.
     * @example changePasswordAsync({
     *     oldPassword: "OldPassword",
     *     newPassword: "NewPassword",
     *     confirmationPassword: "ConfirmationPassword"
     * });
     *
     * @throws {ValidationError} Throws when the data specified in the argument for the
     * `requestDto` parameter is invalid.
     * @throws {NotFoundError} Throws when the user with the specified id doesn't exist or has
     * already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user isn't the target user.
     * @throws {OperationError} Throws when the current password, provided in the
     * `requestDto` argument is incorrect.
     */
    async changePasswordAsync(requestDto: RequestDtos.User.PasswordChange): Promise<void> {
        await apiClient.putAndIgnoreAsync(`/user/changePassword`, requestDto);
    },

    /**
     * Resets a specific user's password.
     *
     * @param id The id of the target user.
     * @param requestDto An object icontaining the new password and the confirmation password
     * for the operation.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @remarks The requesting user and the target user whose id specified by the value of the 
     * `id` argument must be the different one, since a user cannot reset his/her password by
     * himself/herself.
     * @example
     * resetPasswordAsync(1, {
     *     newPassword: "newPassword",
     *     confirmationPassword: "newPassword"
     * });
     *
     * @throws {ValidationError} Throws when the data specified in the argument for the
     * `requestDto` parameter is invalid.
     * @throws {NotFoundError} Throws when the user with the specified id doesn't exist or has
     * already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user is actually the target
     * user, or doesn"t have enough permissions to reset the target user"s password.
     * @throws {OperationError} Throws when the specified new password's complexity doesn't
     * meet the requirement.
     */
    async resetPasswordAsync(id: number, requestDto: PasswordResetRequestDto): Promise<void> {
        await apiClient.putAndIgnoreAsync(`/user/${id}/resetPassword`, requestDto);
    },

    /**
     * Deletes a specific user, specified by the id of the user.
     *
     * @param id The id of the target user.
     * @returns A {@link Promise} representing the asynchronous operation.
     * @example deleteAsync(1);
     *
     * @throws {NotFoundError} Throws when the user with the specified id doesn't exist or has
     * already been deleted.
     * @throws {AuthorizationError} Throws when the requesting user doesn't have enough
     * permissions to delete the target user.
     */
    async deleteAsync(id: number): Promise<void> {
        await apiClient.deleteAndIgnoreAsync(`/user/${id}`);
    },

    /**
     * Get all fields those are used as options to order the results in list retrieving
     * operation.
     *
     * @returns An object containing the options with name and display names of the fields and
     * the default field.
     * @example getListSortingOptionsAsync();
     */
    async getListSortingOptionAsync(): Promise<ResponseDtos.List.SortingOptions> {
        return await apiClient.getAsync("/user/listSortingOptions");
    },

    /**
     * Check if the requesting user has permission to create a new user.
     * 
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getCreatingPermissionAsync();
     */
    async getCreatingPermissionAsync(): Promise<boolean> {
        return await apiClient.getAsync("/user/creatingPermission");
    },

    /**
     * Check if the requesting user has permission to reset a user password.
     * 
     * @param id A {@link number} representing the id of the user to reset password.
     * @returns A {@link Promise} representing the asynchronous operation, which result is
     * `true` if the requesting user has the permission. Otherwise, `false`.
     * @example getResetPasswordPermission(1);
     */
    async getResetPasswordPermissionAsync(id: number): Promise<boolean> {
        return await apiClient.getAsync(`/user/${id}/passwordResetPermission`);
    }
};

/**
 * A service to send requests and handle responses which represent the user-related operations.
 */
export function useUserService() {
    return service;
}