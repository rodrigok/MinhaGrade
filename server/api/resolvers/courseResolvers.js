import CourseModel from '../models/course';
import { isAdminResolver } from '../acl';
import { createResolver, and } from 'apollo-resolvers';
import { createError } from 'apollo-errors';

const CourseNameAlreadyExists = createError('CourseNameAlreadyExists', {
	message: 'Course name already exists'
});

const checkIfNameAlreadyExists = createResolver((root, { _id, name }) => {
	if (CourseModel.findOne({ _id: { $ne: _id }, name })) {
		throw new CourseNameAlreadyExists();
	}
});

export default {
	Query: {
		courses: CourseModel.resolverFindAll
	},
	Mutation: {
		createCourse: and(isAdminResolver, checkIfNameAlreadyExists)(CourseModel.mutationCreate),
		updateCourse: and(isAdminResolver, checkIfNameAlreadyExists)(CourseModel.mutationUpdate),
		removeCourse: and(isAdminResolver)(CourseModel.mutationRemove)
	}
};
