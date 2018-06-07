import {Calendar, Grade, Teachers, Courses} from '../lib/collections';

Meteor.publish('Grade', () => Grade.find());

Meteor.publish('Calendar', function(name) {
	const query = {};
	if (name != null) {
		query._id = name;
	}

	return Calendar.find(query);
});

Meteor.publish('userGradeInfo', function(email) {
	let query = this.userId;
	if (email != null) {
		query =
			{'emails.address': email};
	}

	return Meteor.users.find(query, {fields: {grade: 1, emails: 1, calendar: 1, admin: 1}, sort: {_id: 1}});
});

Meteor.publish('Teachers', () => Teachers.find());
Meteor.publish('Courses', () => Courses.find());
