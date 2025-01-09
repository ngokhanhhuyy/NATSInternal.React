export interface IModelStateErrors extends Record<string, string[]> {}

class IncludingMessagesError extends Error {
    protected readonly _modelStateErrors: IModelStateErrors;

    constructor(modelStateErrors: IModelStateErrors) {
        super();
        this._modelStateErrors = modelStateErrors;
    }

    get errors(): IModelStateErrors {
        return this._modelStateErrors;
    }
}

// Exceptions representing request error
export class ValidationError extends IncludingMessagesError {}
export class DuplicatedError extends IncludingMessagesError {}
export class OperationError extends IncludingMessagesError {}
export class BadRequestError extends IncludingMessagesError {}
export class NotFoundError extends IncludingMessagesError {}
export class AuthenticationError extends Error {}
export class AuthorizationError extends Error {}
export class ConcurrencyError extends Error {}
export class InternalServerError extends Error {}
export class UndefinedError extends Error {}
export class ConnectionError extends Error {}
export class FileTooLargeError extends Error {}