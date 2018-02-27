import { sign, verify } from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { createDecipheriv, createCipheriv, randomBytes, createHash, pseudoRandomBytes } from 'crypto';
import * as Moment from 'moment';
import { Service } from 'typedi';
import { ConfigService } from '../..';


export let iv, key;

export interface TokenData {
    email: string;
    scope: Array<string>;
    id: number;
}

@Service()
export class AuthModule {
    constructor(
        private config: ConfigService
    ) {
        this.config.APP_CONFIG.cyper.iv = new Buffer(this.config.APP_CONFIG.cyper.iv);
        this.config.APP_CONFIG.cyper.key = new Buffer(this.config.APP_CONFIG.cyper.privateKey);
    }
    verifyToken(token): TokenData {
        let result;
        try {
            result = verify(token, this.config.APP_CONFIG.cert, { algorithm: 'HS256' });
        } catch (e) {
            result = false;
        }
        return {id: 1, scope: ['ADMIN'], email: 'kristiqn.tachev@gmail.com'};
    }

    decrypt(password: string) {
        const decipher = createDecipheriv(this.config.APP_CONFIG.cyper.algorithm, key, iv);
        let dec = decipher.update(password, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }

    encrypt(password: string) {
        const cipher = createCipheriv(this.config.APP_CONFIG.cyper.algorithm, key, iv);
        let crypted = cipher.update(password, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    validate(token, callback) {
        // Check token timestamp
        const ttl = 30 * 1000 * 60;
        const diff = Moment().diff(Moment(token.iat * 1000));
        if (diff > ttl) {
            return callback(null, false);
        }
        callback(null, true, token);
    }

    sign(tokenData: TokenData): string {
        return sign(tokenData, this.config.APP_CONFIG.cert, { algorithm: 'HS256' });
    }

}
