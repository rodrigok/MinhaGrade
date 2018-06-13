import { Meteor } from 'meteor/meteor';
import { Calendar, Grade, Teachers, Courses } from '../lib/collections';

Meteor.publish('Grade', () => Grade.find());

Meteor.publish('Calendar', function(name) {
	const query = {};
	if (name != null) {
		query._id = name;
	}

	return Calendar.find(query);
});

Meteor.publish('Teachers', () => Teachers.find());
Meteor.publish('Courses', () => Courses.find());
