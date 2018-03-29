import { ConfigService } from '../../services/config/config.service';
export declare let iv: any, key: any;
export interface TokenData {
    email: string;
    scope: Array<string>;
    id: number;
}
export declare class AuthService {
    private config;
    modifyFunctions: {
        validateToken?: Function;
    };
    constructor(config: ConfigService);
    validateToken(token: string): {
        id: number;
        type: string;
    };
    verifyToken(token: any): TokenData;
    decrypt(password: string): any;
    encrypt(password: string): any;
    validate(token: any, callback: any): any;
    sign(tokenData: TokenData): string;
}
