import { PubSub } from 'graphql-subscriptions';
import { AmqpPubSub } from 'graphql-rabbitmq-subscriptions';
import { ConfigService } from '../config/config.service';
export declare let pubsub: PubSub | AmqpPubSub;
export declare class GapiPubSubService {
    private pubSub;
    private configService;
    sub: AmqpPubSub | PubSub;
    constructor(pubSub: AmqpPubSub | PubSub | any, configService: ConfigService);
    asyncIterator<T>(event: any): AsyncIterator<T>;
    publish(signal: string, data: any): boolean;
}
