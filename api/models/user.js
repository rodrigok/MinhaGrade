import { Meteor } from 'meteor/meteor';
import { pubsub, USER_CHANGE_CHANNEL } from '/api/pubsub';

class UserModel {
	findOne(root, args, { userId }) {
		return Meteor.users.findOne(userId);
	}

	updateGradeItem(root, { _id, status }, { userId }) {
		console.log('updateGradeItem', { _id, status, userId });

		switch (status) {
			case 'done':
			case 'doing':
				Meteor.users.update(userId, {
					$set: {
						[`grade.${ _id }`]: status
					}
				});
				break;

			case 'pending':
				Meteor.users.update(userId, {
					$unset: {
						[`grade.${ _id }`]: 1
					}
				});
				break;
		}

		pubsub.publish(USER_CHANGE_CHANNEL, {
			user: Meteor.users.findOne(userId)
		});
	}
}

export default new UserModel();
