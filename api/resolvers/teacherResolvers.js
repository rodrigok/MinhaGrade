import TeacherModel from '../models/teacher';
import { isAuthenticatedResolver, isAdminResolver } from '/api/acl';
import { createResolver, and } from 'apollo-resolvers';
import { createError } from 'apollo-errors';

const TeacherNameAlreadyExists = createError('TeacherNameAlreadyExists', {
	message: 'Teacher name already exists'
});

const checkIfNameAlreadyExists = createResolver((root, { name }) => {
	if (TeacherModel.findOne({ name })) {
		throw new TeacherNameAlreadyExists();
	}
});

export default {
	Query: {
		teachers: isAuthenticatedResolver.createResolver(TeacherModel.resolverFindAll)
	},
	Mutation: {
		createTeacher: and(isAdminResolver, checkIfNameAlreadyExists)(TeacherModel.mutationCreate),
		updateTeacher: and(isAdminResolver, checkIfNameAlreadyExists)(TeacherModel.mutationUpdate),
		removeTeacher: and(isAdminResolver)(TeacherModel.mutationRemove)
	}
};
