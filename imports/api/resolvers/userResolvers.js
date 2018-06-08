import { isAuthenticatedResolver } from '../acl';

const findOne = (root, args, context) => {
	return context.user;
};

export default {
	Query: {
		user: isAuthenticatedResolver.createResolver(findOne)
	},
	User: {
		mainEmail: ({ emails }) => emails && emails[0]
	}
};
