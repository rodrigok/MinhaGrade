import { combineResolvers } from 'apollo-resolvers';
import TeacherResolvers from './resolvers/teacherResolvers';
import CalendarResolvers from './resolvers/calendarResolvers';
import CourseResolvers from './resolvers/courseResolvers';
import UserResolvers from './resolvers/userResolvers';
import GradeResolvers from './resolvers/gradeResolvers';

export const resolvers = combineResolvers([
	TeacherResolvers,
	CalendarResolvers,
	CourseResolvers,
	UserResolvers,
	GradeResolvers
]);
