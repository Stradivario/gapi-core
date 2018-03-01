import Container, { Service } from "typedi";
import { readFileSync } from "fs";
import { SequelizeConfigInterface, AmqpConfigInterface, AppConfigInterface } from './config.interface';
import { GraphQLObjectType } from "graphql";
import { ControllerContainerService } from "../../new_services/controller-service/controller.service";
import { SchemaService } from "../../services/schema/schema.service";

@Service()
export class ConfigService {
    SEQUELIZE_CONFIG: SequelizeConfigInterface = {
        development: {
            dialect: 'postgres',
            host: process.env.DB_HOST || '172.10.0.10',
            port: process.env.DB_PORT || '5432',
            username: process.env.DB_USERNAME || 'dbuser',
            password: process.env.DB_PASSWORD || 'dbuserpass',
            name: process.env.DB_NAME || 'antitheft',
            logging: false,
            storage: ':memory:',
            modelPaths: [__dirname + '/graphql/core/models']
        },
        testing: {
            dialect: 'postgres',
            host: process.env.DB_HOST || '172.10.0.10',
            port: process.env.DB_PORT || '5432',
            username: process.env.DB_USERNAME || 'dbuser',
            password: process.env.DB_PASSWORD || 'dbuserpass',
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
        host: process.env.AMQP_HOST || '172.10.0.4',
        port: process.env.AMQP_PORT || 5672
    };
    APP_CONFIG: AppConfigInterface = {
        cert: new Buffer(1),
        schema: null,
        uploadFolder: '/home/rampage/Desktop/testUploadDir',
        // tslint:disable-next-line:max-line-length
        graphiqlToken: process.env.GRAPHIQL_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtyaXN0aXFuLnRhY2hldkBnbWFpbC5jb20iLCJzY29wZSI6WyJBRE1JTiJdLCJpZCI6MSwiaWF0IjoxNTE2NjQ1NDMwfQ.NtCild_BQozDUWM-4f2Q94YrKLGUzaELv_rfQcnDVTA',
        port: process.env.API_PORT || 8200,
        fakeUsers: true,
        force: true,
        cyper: <any>{
            iv: 'JkYt1H3fA8JK9L3G',
            privateKey: '8zTVzr3p53VC12jmV54rIYu2545x47lY',
            algorithm: 'aes256',
            key: ''
        },
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

    async syncSchema() {

        const test = Container.get(ControllerContainerService);
        const ticketCtrl = test.getController('TicketController');

        let QueryFields = {};
        Array.from(ticketCtrl._queries.keys()).forEach((key: string) => Object.assign(QueryFields, { [key]: ticketCtrl.getQuery(key) }));


        const Query = new GraphQLObjectType({
            name: 'Query',
            description: 'Query type for all get requests which will not change persistent data',
            fields: {
                ...QueryFields,
            }
        });

        const Mutation = new GraphQLObjectType({
            name: 'Mutation',
            description: 'Mutation type for all requests which will change persistent data',
            fields: {
                //   ...UserMutation,
            }
        });

        const Subscription = new GraphQLObjectType({
            name: 'Subscription',
            description: 'Subscription type for all rabbitmq subscriptions via pub sub',
            fields: {
                //   ...SignalSubscription,
            }
        });

        const schemaService: SchemaService = Container.get(SchemaService);
        const schema = schemaService.generateSchema(Query);
        this.APP_CONFIG.schema = schema;
        return Promise.resolve();
    }
}

