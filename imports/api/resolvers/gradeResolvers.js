import { Grade } from '../../lib/collections';
import { isAuthenticatedResolver } from '../acl';

const find = (root, args, context) => {
	context.course = args.course;
	return Grade.find({
		[`code.${ args.course }`]: { $exists: true }
	}).fetch();
};

export default {
	Query: {
		grades: isAuthenticatedResolver.createResolver(find)
	},
	Grade: {
		code: ({ code }, args, context) => code[context.course],
		name: ({ name }, args, context) => name[context.course],
		semester: ({ semester }, args, context) => semester[context.course],
		requirement: ({ requirement }, args, context) => Grade.find({ [`code.${ context.course }`]: { $in: requirement[context.course] } }).fetch(),
		allNames: ({ name }) => Object.values(name)
	}
};
