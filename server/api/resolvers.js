import { combineResolvers } from 'apollo-resolvers';
import TeacherResolvers from './resolvers/teacherResolvers';
import CalendarResolvers from './resolvers/calendarResolvers';
import CourseResolvers from './resolvers/courseResolvers';
import UserResolvers from './resolvers/userResolvers';
import GradeResolvers from './resolvers/gradeResolvers';
import GraphQLJSON from 'graphql-type-json';

export const resolvers = combineResolvers([
	{
		JSON: GraphQLJSON
	},
	TeacherResolvers,
	CalendarResolvers,
	CourseResolvers,
	UserResolvers,
	GradeResolvers
]);
