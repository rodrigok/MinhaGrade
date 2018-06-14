import GradeModel from '../models/grade';
import { isAuthenticatedResolver } from '/api/acl';

const find = (root, { course }, context) => {
	if (course) {
		context.course = course;
	}

	return GradeModel.find({
		[`code.${ course }`]: { $exists: true }
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
		requirement: ({ requirement }, args, context) => GradeModel.find({ [`code.${ context.course }`]: { $in: requirement[context.course] } }).fetch(),
		allNames: ({ name }) => Object.values(name)
	}
};
