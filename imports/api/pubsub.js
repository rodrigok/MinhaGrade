import { PubSub } from 'graphql-subscriptions';

export { withFilter } from 'graphql-subscriptions';
export const pubsub = new PubSub();
export const USER_CHANGE_CHANNEL = 'USER_RANDOM_CHANGE';
