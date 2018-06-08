import {Teachers, Calendar} from '../lib/collections';
import { Random } from 'meteor/random';

export const resolvers = {
	Query: {
		user(root, args, context) {
			/*
       * We access to the current user here thanks to the context. The current
       * user is added to the context thanks to the `meteor/apollo` package.
       */
			return context.user;
		},
		teachers(root, args, context) {
			if (context.user && context.user.admin) {
				return Teachers.find().fetch();
			}
		},
		calendars(root, args, context) {
			if (context.user && context.user.admin) {
				return Calendar.find().fetch();
			}
		}
	},
	User: {
		emails: ({ emails }) => emails,
		randomString: () => Random.id()
	},
	CalendarItem: {
		teacher: ({teacher}) => Teachers.findOne({_id: teacher})
	}
};
