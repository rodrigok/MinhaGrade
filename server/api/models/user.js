import { Meteor } from 'meteor/meteor';
import { pubsub, GRADE_CHANGE_CHANNEL } from '../pubsub';
import { _BaseModel } from './_Base';
import GradeModel from './grade';

class UserModel extends _BaseModel {

	constructor() {
		super(Meteor.users);
	}

	findOneByIdWithFacebookToken(_id, options) {
		const query = {
			_id,
			'services.facebook.accessToken': {
				$exists: true,
			},
		};
		return Meteor.users.findOne(query, options);
	}

	findOneByEmailAddress(emailAddress, options) {
		const query = { 'emails.address': emailAddress.toLowerCase() };

		return Meteor.users.findOne(query, options);
	}

	findFriendsFacebookByIdsInterestedIn(friendIds, calendarId, key, options) {
		const query = {
			'services.facebook.id': {
				$in: friendIds,
			},
			[`calendar.${ calendarId }`]: key,
		};

		return Meteor.users.find(query, options);
	}

	setServiceId(_id, serviceName, serviceId) {
		const update = { $set: {} };

		const serviceIdKey = `services.${ serviceName }.id`;
		update.$set[serviceIdKey] = serviceId;

		return Meteor.users.update(_id, update);
	}

	setEmailVerified(_id, email) {
		const query = {
			_id,
			emails: {
				$elemMatch: {
					address: email,
					verified: false,
				},
			},
		};

		const update = {
			$set: {
				'emails.$.verified': true,
			},
		};

		return Meteor.users.update(query, update);
	}

	updateGradeItem(root, { _id, status }, { userId }) {
		console.log('updateGradeItem', { _id, status, userId });

		switch (status) {
			case 'done':
			case 'doing':
				Meteor.users.update(userId, {
					$set: {
						[`grade.${ _id }`]: status,
					},
				});
				break;

			case 'pending':
				Meteor.users.update(userId, {
					$unset: {
						[`grade.${ _id }`]: 1,
					},
				});
				break;
		}

		pubsub.publish(GRADE_CHANGE_CHANNEL, {
			userId,
			grade: GradeModel.findOne({ _id }),
		});
	}
}

export default new UserModel();
