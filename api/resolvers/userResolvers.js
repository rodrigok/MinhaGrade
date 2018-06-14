import UserModel from '../models/user';
import { isAuthenticatedResolver } from '/api/acl';
import { pubsub, withFilter, USER_CHANGE_CHANNEL } from '/api/pubsub';

export default {
	Query: {
		user: isAuthenticatedResolver.createResolver(UserModel.findOne)
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
	},
	Mutation: {
		updateGradeItem: isAuthenticatedResolver.createResolver(UserModel.updateGradeItem)
	}
};
