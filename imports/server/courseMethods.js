import { Courses } from '../lib/collections';

Meteor.methods({
	createCourse({ name }) {
		console.log('createCourse', { name });

		if (this.userId == null) {
			return;
		}

		const user = Meteor.users.findOne(this.userId);
		if (user.admin !== true) {
			return;
		}

		if (Courses.findOne({ name })) {
			throw new Meteor.Error('Course-name-already-exists');
		}

		return Courses.insert({ name });
	},

	removeCourse({ _id }) {
		console.log('removeCourse', { _id });

		if (this.userId == null) {
			return;
		}

		const user = Meteor.users.findOne(this.userId);
		if (user.admin !== true) {
			return;
		}

		return Courses.remove({ _id });
	},

	updateCourse({ _id, name }) {
		console.log('updateCourse', { _id });

		if (this.userId == null) {
			return;
		}

		const user = Meteor.users.findOne(this.userId);
		if (user.admin !== true) {
			return;
		}

		return Courses.update({ _id }, { $set: { name } });
	}
});
