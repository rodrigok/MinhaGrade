import CalendarModel from '../models/calendar';
import TeacherModel from '../models/teacher';
import GradeModel from '../models/grade';
import UserModel from '../models/user';
import { isAuthenticatedResolver, isAdminResolver } from '../acl';
import { createResolver, and } from 'apollo-resolvers';
import { createError } from 'apollo-errors';
import graph from 'fbgraph';
import promisify from 'promisify-node';


graph.get = promisify(graph.get);

const NameAlreadyExists = createError('NameAlreadyExists', {
	message: 'Name already exists'
});

const AnotherCalendarActive = createError('AnotherCalendarActive', {
	message: 'Another calendar is already active'
});

const checkIfNameAlreadyExists = createResolver((root, { name }) => {
	if (CalendarModel.findOne({ name })) {
		throw new NameAlreadyExists();
	}
});

const findOne = async(root, args, context) => {
	const result = CalendarModel.findOne({
		active: true
	});

	context.calendarId = result._id;

	const user = UserModel.findOneByIdWithFacebookToken(context.userId, { fields: { 'services.facebook.accessToken': 1 } });
	if (user) {
		try {
			graph.setAccessToken(user.services.facebook.accessToken);
			const { data } = await graph.get('me/friends?fields=id,name,picture');
			context.friends = data.map((i) => {
				i.pictureUrl = i.picture.data.url;
				return i;
			});
		} catch (e) {
			console.log(e);
		}
	}

	return result;
};

const activateCalendar = (root, { _id, active }) => {
	if (active && CalendarModel.findOne({ active: true })) {
		throw new AnotherCalendarActive();
	}

	CalendarModel.update({ _id }, { $set: { active } }) === 1;
};

export default {
	Query: {
		calendar: findOne,
		calendars: isAuthenticatedResolver.createResolver(CalendarModel.resolverFindAll)
	},
	Mutation: {
		createCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(CalendarModel.mutationCreate),
		updateCalendar: and(isAdminResolver, checkIfNameAlreadyExists)(CalendarModel.mutationUpdate),
		removeCalendar: and(isAdminResolver)(CalendarModel.mutationRemove),
		activateCalendar: and(isAdminResolver)(activateCalendar),
		updateCalendarItemInterest: isAuthenticatedResolver.createResolver(CalendarModel.updateCalendarItemInterest),
		setTeacherInCalendarItem: and(isAdminResolver)(CalendarModel.setTeacherInCalendarItem),
		removeItemFromCalendar: and(isAdminResolver)(CalendarModel.removeItemFromCalendar),
		addItemToCalendar: and(isAdminResolver)(CalendarModel.addItemToCalendar)
	},
	Calendar: {
		grade: ({ grade }) => grade || []
	},
	CalendarItem: {
		// _id needs to hava a unique identifier
		_id: ({ _id, shift, day }) => `${ _id }:${ shift }:${ day }`,
		teacher: ({ teacher }) => TeacherModel.findOne({ _id: teacher }),
		grade: ({ _id }, { course }, context) => {
			if (course) {
				context.course = course;
			} else if (context.userId) {
				context.course = UserModel.findOne(context.userId).profile.course;
			}

			return GradeModel.findOne({ _id });
		},
		userStatus: ({ _id }, args, { userId }) => {
			if (!userId) {
				return;
			}

			const user = UserModel.findOne({
				_id: userId,
				[`grade.${ _id }`]: {
					$exists: true
				}
			}, { grade: 1 });

			if (user) {
				return user.grade[_id];
			}

			return 'pending';
		},
		userInterested: ({ _id, shift, day }, args, { userId, calendarId }) => {
			if (!userId) {
				return false;
			}

			const key = `${ shift }${ day }-${ _id }`;

			const user = UserModel.findOne({
				_id: userId,
				[`calendar.${ calendarId }`]: key
			}, { fields: { grade: 1 } });

			if (user) {
				return true;
			}
		},
		friendsInterested: ({ _id, shift, day }, args, { userId, friends, calendarId }) => {
			if (!userId) {
				return [];
			}

			if (!friends || friends.length === 0) {
				return [];
			}

			const key = `${ shift }${ day }-${ _id }`;

			const ids = friends.map((i) => i.id);
			const users = UserModel.findFriendsFacebookByIdsInterestedIn(ids, calendarId, key, { fields: { 'services.facebook.id': 1 } }).fetch().map((i) => i.services.facebook.id);
			return friends.filter((i) => users.includes(i.id));
		}
	}
};
