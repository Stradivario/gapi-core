import { PubSub } from 'graphql-subscriptions';
import { AmqpPubSub } from 'graphql-rabbitmq-subscriptions';
import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server/lib';
import * as Logger from 'bunyan';
import { Service } from '../../container/index';
import { ConfigService } from '../config/config.service';

export let pubsub: PubSub | AmqpPubSub;

const logger: Logger = ConsoleLogger.create('<app name>', <IConsoleLoggerSettings>{
    level: 'info', // Optional: default 'info' ('trace'|'info'|'debug'|'warn'|'error'|'fatal')
    mode: 'raw' // Optional: default 'short' ('short'|'long'|'dev'|'raw')
});

@Service()
export class GapiPubSubService {
    sub: AmqpPubSub | PubSub;
    constructor(
        private pubSub: AmqpPubSub | PubSub | any,
        private configService: ConfigService
    ) {
        if (pubSub) {
            this.sub = pubSub;
        } else if (process.env.NODE_ENV === 'production') {
            this.sub = new AmqpPubSub({
                config: {
                    host: this.configService.AMQP_CONFIG.host,
                    port: this.configService.AMQP_CONFIG.port,
                },
                logger,
            });
        } else {
            this.sub = new PubSub();
        }
    }
    asyncIterator<T>(event): AsyncIterator<T> {
        return this.sub.asyncIterator<T>(event);
    }
    publish(signal: string, data: any): boolean {
        return this.sub.publish(signal, data);
    }
}



