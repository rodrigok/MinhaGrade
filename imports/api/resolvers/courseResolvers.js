import { Courses } from '../../lib/collections';
import { isAuthenticatedResolver, isAdminResolver } from '../acl';
import { createResolver, and } from 'apollo-resolvers';
import { createError } from 'apollo-errors';

const CourseNameAlreadyExists = createError('CourseNameAlreadyExists', {
	message: 'Course name already exists'
});

const checkIfNameAlreadyExists = createResolver((root, { name }) => {
	if (Courses.findOne({ name })) {
		throw new CourseNameAlreadyExists();
	}
});

const findAllCourses = () => {
	return Courses.find().fetch();
};

const addCourse = (root, { name }) => {
	return Courses.findOne(Courses.insert({ name }));
};

const updateCourse = (root, { _id, name }) => {
	Courses.update({ _id }, { $set: { name } });
	return Courses.findOne(_id);
};

export default {
	Query: {
		courses: isAuthenticatedResolver.createResolver(findAllCourses)
	},
	Mutation: {
		addCourse: and(isAdminResolver, checkIfNameAlreadyExists)(addCourse),
		updateCourse: and(isAdminResolver, checkIfNameAlreadyExists)(updateCourse)
	}
};
