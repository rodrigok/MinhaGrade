import { Meteor } from 'meteor/meteor';
import { createResolver } from 'apollo-resolvers';
import { createError, isInstance } from 'apollo-errors';

const ForbiddenError = createError('ForbiddenError', {
	message: 'You are not allowed to do this'
});

const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
	message: 'You must be logged in to do this'
});

const UnknownError = createError('UnknownError', {
	message: 'An unknown error has occurred!  Please try again later'
});

export const baseResolver = createResolver(
	//incoming requests will pass through this resolver like a no-op
	null,

	/*
    Only mask outgoing errors that aren't already apollo-errors,
    such as ORM errors etc
  */
	(root, args, context, error) => {
		console.error(error);
		return isInstance(error) ? error : new UnknownError();
	}
);

export const isAuthenticatedResolver = baseResolver.createResolver(
	(root, args, { userId }) => {
		if (!userId) {
			throw new AuthenticationRequiredError();
		}
	}
);

export const isAdminResolver = isAuthenticatedResolver.createResolver(
	(root, args, { userId }) => {
		const user = Meteor.users.findOne(userId, { fields: { admin: 1 } });

		if (!user.admin) {
			throw new ForbiddenError();
		}
	}
);
