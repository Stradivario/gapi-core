import { readFileSync } from 'fs';
import { AmqpConfigInterface, AppConfigInterface } from './config.interface';
import { GraphQLObjectType } from 'graphql';
import { ControllerContainerService } from '../../services/controller-service/controller.service';
import { SchemaService } from '../../services/schema/schema.service';
import { Service } from '../../../utils/container/index';
import { Container } from '../../container/Container';
import { ConnectionHookService } from '../../services/connection-hook/connection-hook.service';

@Service()
export class ConfigService {
    cert: Buffer;
    AMQP_CONFIG: AmqpConfigInterface = {
        host: process.env.AMQP_HOST || '182.10.0.5',
        port: process.env.AMQP_PORT || 5672
    };
    APP_CONFIG: AppConfigInterface = {
        graphiql: process.env.GRAPHIQL === 'true' ? true : false,
        cert: this.cert,
        schema: null,
        uploadFolder: '',
        // tslint:disable-next-line:max-line-length
        port: process.env.API_PORT || process.env.PORT || 9000,
        cyper: <any>{
            iv: 'Jkyt1H3FA8JK9L3A',
            privateKey: '8zTVzr3p53VC12jHV54rIYu2545x47lY',
            algorithm: 'aes256',
            key: ''
        },
        connectionHooks: this.connectionHookService,
        ethereumApi: process.env.ETHEREUM_API || 'http://localhost:7545' || 'http://pub-node1.etherscan.io:8545'
    };
    constructor(
        private connectionHookService: ConnectionHookService
    ) {
        try {
            this.cert = readFileSync(process.env.API_CERT || './cert.key');
            this.APP_CONFIG.cert = this.cert;
        } catch (e) {
            console.log('This server will be runned without authentication!');
            this.cert = null;
            this.APP_CONFIG.cert = null;
        }
    }

    getApp() {
        return this.APP_CONFIG;
    }

    getAmqp() {
        return this.AMQP_CONFIG;
    }

    setAppConfig(config: AppConfigInterface) {
        this.APP_CONFIG = config;
    }

    static forRoot(config: { APP_CONFIG?: AppConfigInterface, AMQP_CONFIG?: AmqpConfigInterface }) {
        const configService = Container.get(ConfigService);
        configService.APP_CONFIG = config.APP_CONFIG;
        configService.AMQP_CONFIG = config.AMQP_CONFIG;
        return ConfigService;
    }
}

