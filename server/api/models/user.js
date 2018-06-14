import { Meteor } from 'meteor/meteor';
import { pubsub, USER_CHANGE_CHANNEL } from '../pubsub';
import { _BaseModel } from './_Base';

class UserModel extends _BaseModel {

	constructor() {
		super(Meteor.users);
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
