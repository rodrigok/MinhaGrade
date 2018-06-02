Meteor.methods({
	updateGradeItem(gradeItemId, status) {
		console.log('updateGradeItem', gradeItemId, status);

		if (this.userId == null) {
			return;
		}

		switch (status) {
			case 'done': case 'doing':
				var update = {};
				update[`grade.${gradeItemId}`] = status;
				return Meteor.users.update(this.userId, {$set: update});

			case 'pending':
				update = {};
				update[`grade.${gradeItemId}`] = 1;
				return Meteor.users.update(this.userId, {$unset: update});
		}
	}
});
