import GradeModel from '../models/grade';
import UserModel from '../models/user';

const find = (root, { course }, context) => {
	if (course) {
		context.course = course;
	} else if (context.userId) {
		context.course = UserModel.findOne(context.userId).profile.course;
	}

	return GradeModel.find({
		[`code.${ context.course }`]: { $exists: true }
	}).fetch();
};

export default {
	Query: {
		grades: find
	},
	Grade: {
		code: ({ code }, args, context) => code[context.course],
		name: ({ name }, args, context) => name[context.course],
		semester: ({ semester }, args, context) => semester[context.course],
		requirement: ({ requirement }, args, context) => GradeModel.find({ [`code.${ context.course }`]: { $in: requirement[context.course] } }).fetch(),
		allNames: ({ name }) => Object.values(name)
	}
};
