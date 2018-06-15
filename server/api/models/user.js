import { Meteor } from 'meteor/meteor';
import { pubsub, GRADE_CHANGE_CHANNEL } from '../pubsub';
import { _BaseModel } from './_Base';
import GradeModel from './grade';

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

		pubsub.publish(GRADE_CHANGE_CHANNEL, {
			userId,
			grade: GradeModel.findOne({ _id })
		});
	}
}

export default new UserModel();
