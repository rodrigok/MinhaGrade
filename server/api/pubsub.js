import { PubSub } from 'graphql-subscriptions';

export { withFilter } from 'graphql-subscriptions';
export const pubsub = new PubSub();
export const GRADE_CHANGE_CHANNEL = 'GRADE_CHANGE_CHANNEL';
