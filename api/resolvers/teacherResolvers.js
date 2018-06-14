import { Teachers } from '/lib/collections';
import { isAuthenticatedResolver, isAdminResolver } from '/api/acl';
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

const createTeacher = (root, { name }) => {
	return Teachers.findOne(Teachers.insert({ name }));
};

const updateTeacher = (root, { _id, name }) => {
	Teachers.update({ _id }, { $set: { name } });
	return Teachers.findOne({ _id });
};

const removeTeacher = (root, { _id }) => {
	return Teachers.remove({ _id });
};

export default {
	Query: {
		teachers: isAuthenticatedResolver.createResolver(findAllTeachers)
	},
	Mutation: {
		createTeacher: and(isAdminResolver, checkIfNameAlreadyExists)(createTeacher),
		updateTeacher: and(isAdminResolver, checkIfNameAlreadyExists)(updateTeacher),
		removeTeacher: and(isAdminResolver)(removeTeacher)
	}
};
