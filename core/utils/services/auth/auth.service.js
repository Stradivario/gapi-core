"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const crypto_1 = require("crypto");
const Moment = require("moment");
const index_1 = require("../../../utils/container/index");
const config_service_1 = require("../../services/config/config.service");
let AuthService = class AuthService {
    constructor(config) {
        this.config = config;
        this.modifyFunctions = {
            validateToken: this.validateToken
        };
        this.config.APP_CONFIG.cyper.iv = new Buffer(this.config.APP_CONFIG.cyper.iv);
        this.config.APP_CONFIG.cyper.key = new Buffer(this.config.APP_CONFIG.cyper.privateKey);
    }
    validateToken(token) {
        return { id: 1, user: { id: 1, type: 'ADMIN' } };
    }
    verifyToken(token) {
        let result;
        try {
            result = jsonwebtoken_1.verify(token, this.config.APP_CONFIG.cert, { algorithm: 'HS256' });
        }
        catch (e) {
            result = false;
        }
        return result;
    }
    decrypt(password) {
        const decipher = crypto_1.createDecipheriv(this.config.APP_CONFIG.cyper.algorithm, this.config.APP_CONFIG.cyper.privateKey, this.config.APP_CONFIG.cyper.iv);
        let dec = decipher.update(password, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
    encrypt(password) {
        const cipher = crypto_1.createCipheriv(this.config.APP_CONFIG.cyper.algorithm, this.config.APP_CONFIG.cyper.privateKey, this.config.APP_CONFIG.cyper.iv);
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
    sign(tokenData) {
        return jsonwebtoken_1.sign(tokenData, this.config.APP_CONFIG.cert, { algorithm: 'HS256' });
    }
};
AuthService = __decorate([
    index_1.Service(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
