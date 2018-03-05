import { readFileSync } from "fs";
import { SequelizeConfigInterface, AmqpConfigInterface, AppConfigInterface } from './config.interface';
import { GraphQLObjectType } from "graphql";
import { ControllerContainerService } from "../../services/controller-service/controller.service";
import { SchemaService } from "../../services/schema/schema.service";
import { Service } from "../../../../core/utils/container/index";
import { Container } from "../../container/Container";
import { ConnectionHookService } from "../../services/connection-hook/connection-hook.service";

@Service()
export class ConfigService {

    constructor(
        private connectionHookService: ConnectionHookService
    ) {
        
    }
    SEQUELIZE_CONFIG: SequelizeConfigInterface = {
        development: {
            dialect: 'postgres',
            host: process.env.DB_HOST || '172.10.0.10',
            port: process.env.DB_PORT || '5432',
            username: process.env.DB_USERNAME || '',
            password: process.env.DB_PASSWORD || '',
            name: process.env.DB_NAME || '',
            logging: false,
            storage: ':memory:',
            modelPaths: [__dirname + '/graphql/core/models']
        },
        testing: {
            dialect: 'postgres',
            host: process.env.DB_HOST || '172.10.0.180',
            port: process.env.DB_PORT || '5432',
            username: process.env.DB_USERNAME || '',
            password: process.env.DB_PASSWORD || '',
            name: process.env.DB_NAME || 'testing',
            storage: ':memory:',
            logging: false,
            modelPaths: [__dirname + '/graphql/core/models']
        },
        // production: {
        //   dialect: 'postgres',
        //   host: process.env.DB_HOST_PROD || 'tachenstore.ckffxbb4tx28.us-east-2.rds.amazonaws.com',
        //   port: process.env.DB_PORT_PROD || '5432',
        //   username: process.env.DB_USERNAME_PROD || 'dbuser',
        //   password: process.env.DB_PASSWORD_PROD || 'dbuserpass',
        //   name: process.env.DB_NAME_PROD || 'postgres',
        //   storage: ':memory:',
        //   modelPaths: [__dirname + '/graphql/core/models']
        // }
    };
    AMQP_CONFIG: AmqpConfigInterface = {
        host: process.env.AMQP_HOST || '172.10.0.181',
        port: process.env.AMQP_PORT || 5672
    };
    APP_CONFIG: AppConfigInterface = {
        cert: new Buffer(1),
        schema: null,
        uploadFolder: '',
        // tslint:disable-next-line:max-line-length
        graphiqlToken: process.env.GRAPHIQL_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJzY29wZSI6WyJBRE1JTiJdLCJpZCI6MSwiaWF0IjoxNTE2NjQ1NDMwfQ.NtCild_BQozDUWM-4f2Q94YrKLGUzaELv_rfQcnDVTA',
        port: process.env.API_PORT || 8200,
        fakeUsers: true,
        force: true,
        cyper: <any>{
            iv: 'Jkyt1H3FA8JK9L3A',
            privateKey: '8zTVzr3p53VC12jHV54rIYu2545x47lY',
            algorithm: 'aes256',
            key: ''
        },
        connectionHooks: this.connectionHookService,
        ethereumApi: process.env.ETHEREUM_API || 'http://localhost:7545' || 'http://pub-node1.etherscan.io:8545'
    };

    getApp() {
        return this.APP_CONFIG;
    }

    getSequelize() {
        return this.SEQUELIZE_CONFIG;
    }

    getAmqp() {
        return this.AMQP_CONFIG;
    }

    setAppConfig(config: AppConfigInterface) {
        this.APP_CONFIG = config;
    }

    static forRoot(config: {APP_CONFIG?: AppConfigInterface, AMQP_CONFIG?: AmqpConfigInterface, SEQUELIZE_CONFIG?: SequelizeConfigInterface}) {
        const configService = Container.get(ConfigService);
        configService.APP_CONFIG = config.APP_CONFIG;
        configService.AMQP_CONFIG = config.AMQP_CONFIG;
        configService.SEQUELIZE_CONFIG = config.SEQUELIZE_CONFIG;
        return ConfigService;
    }
}

