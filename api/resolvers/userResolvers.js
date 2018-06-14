import { Meteor } from 'meteor/meteor';
import { isAuthenticatedResolver } from '/api/acl';
import { pubsub, withFilter, USER_CHANGE_CHANNEL } from '/api/pubsub';

const findOne = (root, args, { userId }) => {
	return Meteor.users.findOne(userId);
};

const updateGradeItem = (root, { _id, status }, { userId }) => {
	console.log('updateGradeItem', { _id, status, userId });

	switch (status) {
		case 'done':
		case 'doing':
			Meteor.users.update(userId, {
				$set: {
					[`grade.${ _id }`]: status
				}
			});
			break;

		case 'pending':
			Meteor.users.update(userId, {
				$unset: {
					[`grade.${ _id }`]: 1
				}
			});
			break;
	}

	pubsub.publish(USER_CHANGE_CHANNEL, {
		user: Meteor.users.findOne(userId)
	});
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
	},
	Mutation: {
		updateGradeItem: isAuthenticatedResolver.createResolver(updateGradeItem)
	}
};
