Meteor.methods({
	updateGradeItem(gradeItemId, status) {
		console.log('updateGradeItem', gradeItemId, status);

		if (this.userId == null) {
			return;
		}

		switch (status) {
			case 'done':
			case 'doing':
				return Meteor.users.update(this.userId, {
					$set: {
						[`grade.${ gradeItemId }`]: status
					}
				});

			case 'pending':
				return Meteor.users.update(this.userId, {
					$unset: {
						[`grade.${ gradeItemId }`]: 1
					}
				});
		}
	}
});
