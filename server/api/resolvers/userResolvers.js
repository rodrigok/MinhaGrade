import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { DDP } from 'meteor/ddp';
import { DDPCommon } from 'meteor/ddp-common';
import UserModel from '../models/user';
import CourseModel from '../models/course';
import { isAuthenticatedResolver } from '../acl';
import { pubsub, withFilter, USER_CHANGE_CHANNEL } from '../pubsub';

const findOne = (root, args, { userId }) => {
	if (!userId) {
		return;
	}

	return UserModel.findOne({ _id: userId });
};

const login = (root, { email, password }) => {
	const invocation = new DDPCommon.MethodInvocation({
		connection: {
			close() {}
		}
	});

	try {
		const auth = DDP._CurrentInvocation.withValue(invocation, () => Meteor.call('login', {
			password,
			user: {
				email
			}
		}));

		return {
			...auth,
			success: true
		};
	} catch (error) {
		return {
			success: false
		};
	}
};

const signup = (root, { email, password, course }) => {
	try {
		Accounts.createUser({
			email,
			password,
			profile: {
				course
			}
		});

		return {
			success: true
		};
	} catch (error) {
		return {
			success: false
		};
	}
};

export default {
	Query: {
		user: findOne
	},
	User: {
		mainEmail: ({ emails }) => emails && emails[0]

	},
	UserProfile: {
		course: ({ course }) => CourseModel.findOne(course)
	},
	Subscription: {
		user: {
			subscribe: withFilter(() => pubsub.asyncIterator(USER_CHANGE_CHANNEL), (payload, variables, { userId }) => {
				return payload.user._id === userId;
			})
		}
	},
	Mutation: {
		updateGradeItem: isAuthenticatedResolver.createResolver(UserModel.updateGradeItem),
		login,
		signup
	}
};
