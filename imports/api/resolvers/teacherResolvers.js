import { Teachers } from '../../lib/collections';
import { isAuthenticatedResolver, isAdminResolver } from '../acl';
import { createResolver, and } from 'apollo-resolvers';
import { createError } from 'apollo-errors';

const TeacherNameAlreadyExists = createError('TeacherNameAlreadyExists', {
	message: 'Teacher name already exists'
});

const checkIfNameAlreadyExists = createResolver((root, { name }) => {
	if (Teachers.findOne({ name })) {
		throw new TeacherNameAlreadyExists();
	}
});

const findAllTeachers = () => {
	return Teachers.find().fetch();
};

const addTeacher = (root, { name }) => {
	return Teachers.findOne(Teachers.insert({ name }));
};

const updateTeacher = (root, { _id, name }) => {
	Teachers.update({ _id }, { $set: { name } });
	return Teachers.findOne(_id);
};

export default {
	Query: {
		teachers: isAuthenticatedResolver.createResolver(findAllTeachers)
	},
	Mutation: {
		addTeacher: and(isAdminResolver, checkIfNameAlreadyExists)(addTeacher),
		updateTeacher: and(isAdminResolver, checkIfNameAlreadyExists)(updateTeacher)
	}
};
