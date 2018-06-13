import { pubsub, USER_CHANGE_CHANNEL } from '../api/pubsub';

Meteor.methods({
	updateGradeItem(gradeItemId, status) {
		console.log('updateGradeItem', gradeItemId, status);

		if (this.userId == null) {
			return;
		}

		switch (status) {
			case 'done':
			case 'doing':
				Meteor.users.update(this.userId, {
					$set: {
						[`grade.${ gradeItemId }`]: status
					}
				});
				break;

			case 'pending':
				Meteor.users.update(this.userId, {
					$unset: {
						[`grade.${ gradeItemId }`]: 1
					}
				});
				break;
		}

		pubsub.publish(USER_CHANGE_CHANNEL, {
			user: Meteor.users.findOne(this.userId)
		});
	}
});
