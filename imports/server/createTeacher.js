import {Teachers} from '../lib/collections';

Meteor.methods({
	createTeacher({name}) {
		console.log('createTeacher', {name});

		if (this.userId == null) {
			return;
		}

		const user = Meteor.users.findOne(this.userId);
		if (user.admin !== true) {
			return;
		}

		if (Teachers.findOne({name})) {
			throw new Meteor.Error('teacher-name-already-exists');
		}

		return Teachers.insert({name});
	},

	removeTeacher({_id}) {
		console.log('removeTeacher', {_id});

		if (this.userId == null) {
			return;
		}

		const user = Meteor.users.findOne(this.userId);
		if (user.admin !== true) {
			return;
		}

		return Teachers.remove({_id});
	},

	updateTeacher({_id, name}) {
		console.log('updateTeacher', {_id});

		if (this.userId == null) {
			return;
		}

		const user = Meteor.users.findOne(this.userId);
		if (user.admin !== true) {
			return;
		}

		return Teachers.update({_id}, {$set: {name}});
	}
});
