import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { DDP } from 'meteor/ddp';
import { DDPCommon } from 'meteor/ddp-common';
import UserModel from '../models/user';
import CourseModel from '../models/course';
import { isAuthenticatedResolver } from '../acl';
// import { pubsub, withFilter, USER_CHANGE_CHANNEL } from '../pubsub';

const findOne = (root, args, { userId }) => {
	if (args.userId) {
		userId = args.userId;
	}

	if (!userId) {
		return;
	}

	return UserModel.findOne({ _id: userId });
};

const login = (root, { email, password }) => {
	const invocation = new DDPCommon.MethodInvocation({
		connection: {
			close() {},
		},
	});

	try {
		const auth = DDP._CurrentInvocation.withValue(invocation, () => Meteor.call('login', {
			password,
			user: {
				email,
			},
		}));

		return {
			...auth,
			success: true,
		};
	} catch (error) {
		return {
			success: false,
		};
	}
};

const signup = (root, { name, email, password, course }) => {
	try {
		Accounts.createUser({
			email,
			password,
			profile: {
				name,
				course,
			},
		});

		return {
			success: true,
		};
	} catch (error) {
		return {
			success: false,
		};
	}
};

const setCourse = (root, { course }, { userId }) => {
	if (!userId) {
		return false;
	}

	Meteor.users.update({ _id: userId }, { $set: { 'profile.course': course } });
	return true;
};

const setPassword = (root, { currentPassword, password }, { userId }) => {
	if (!userId) {
		return false;
	}

	const user = Meteor.users.findOne({ _id: userId, 'services.password.bcrypt': { $exists: true } }, { fields: { 'services.password.bcrypt': 1 } });

	if (user) {
		try {
			Accounts._checkPassword(user, currentPassword, { logout: false });
		} catch (e) {
			return false;
		}
	}

	Accounts.setPassword(userId, password);
	return true;
};

export default {
	Query: {
		user: findOne,
	},
	User: {
		mainEmail: ({ emails }) => emails && emails[0],
		hasPassword: ({ services }) => services && services.password && services.password.bcrypt != null,
	},
	UserProfile: {
		course: ({ course }) => CourseModel.findOne({ _id: course }),
	},
	Mutation: {
		updateGradeItem: isAuthenticatedResolver.createResolver(UserModel.updateGradeItem),
		login,
		signup,
		setCourse,
		setPassword,
	},
};
