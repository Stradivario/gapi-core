import * as formatError from 'apollo-errors';
import * as boom from 'boom';
export declare type errorsType = 'invalid-address' | 'not-enought-funds' | 'transaction-reverted' | 'account-locked' | 'unknown-error' | 'missing-wallet-id' | 'unauthorized' | 'invalid-user-name' | 'invalid-address-to' | 'invalid-address-from' | 'wrong-user-name-or-password' | 'account-not-found' | 'invalid-account-password';
export interface ServerErrors {
    name: errorsType;
    data: {
        bg: {
            message: string;
        };
        en: {
            message: string;
        };
    };
}
export declare const ErrorMessages: ServerErrors[];
export declare class ServerErrorsList {
    errorsList: ServerErrors[];
    map(err: errorsType): string;
}
export declare const attachErrorHandlers: (error: any, returnNull?: boolean) => formatError.ErrorInfo;
export declare const clientErrors: typeof formatError;
export declare const Boom: typeof boom;
export declare function createError(name: errorsType, message: string, data?: any): void;
export declare const errorUnauthorized: () => never;
export declare function transactionError(e: any): void;
