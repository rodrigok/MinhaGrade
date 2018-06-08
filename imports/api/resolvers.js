import {
	Teachers,
	Calendar,
	Grade,
	Courses
} from '../lib/collections';

export const resolvers = {
	Query: {
		user(root, args, context) {
			return context.user;
		},
		teachers(root, args, context) {
			if (context.user) {
				return Teachers.find().fetch();
			}
		},
		calendars(root, args, context) {
			if (context.user) {
				return Calendar.find().fetch();
			}
		},
		grades(root, args, context) {
			context.course = args.course;
			if (context.user) {
				return Grade.find({
					[`code.${ args.course }`]: {$exists: true}
				}).fetch();
			}
		},
		courses(root, args, context) {
			if (context.user) {
				return Courses.find().fetch();
			}
		}
	},
	User: {
		mainEmail: ({emails}) => emails && emails[0]
	},
	CalendarItem: {
		teacher: ({teacher}) => Teachers.findOne({_id: teacher})
	},
	Grade: {
		code: ({code}, args, context) => code[context.course],
		name: ({name}, args, context) => name[context.course],
		semester: ({semester}, args, context) => semester[context.course],
		requirement: ({requirement}, args, context) => Grade.find({[`code.${ context.course }`]: {$in: requirement[context.course]}}).fetch()
	}
};
