import { isAuthenticatedResolver } from '../acl';
import { pubsub, withFilter, USER_CHANGE_CHANNEL } from '../pubsub';

const findOne = (root, args, { userId }) => {
	return Meteor.users.findOne(userId);
};

export default {
	Query: {
		user: isAuthenticatedResolver.createResolver(findOne)
	},
	User: {
		mainEmail: ({ emails }) => emails && emails[0]
	},
	Subscription: {
		user: {
			subscribe: withFilter(() => pubsub.asyncIterator(USER_CHANGE_CHANNEL), (payload, variables, { userId }) => {
				return payload.user._id === userId;
			})
		}
	}
};
