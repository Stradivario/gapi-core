import { ConfigService } from '../..';
export declare let iv: any, key: any;
export interface TokenData {
    email: string;
    scope: Array<string>;
    id: number;
}
export declare class AuthModule {
    private config;
    constructor(config: ConfigService);
    verifyToken(token: any): TokenData;
    decrypt(password: string): string;
    encrypt(password: string): string;
    validate(token: any, callback: any): any;
    sign(tokenData: TokenData): string;
}
