import { ResolverFn, FilterFn } from 'graphql-subscriptions';
export declare function Subscribe<T>(asyncIteratorFunction: ResolverFn | AsyncIterator<T>, filterFn?: FilterFn): Function;
