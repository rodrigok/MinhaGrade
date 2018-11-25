import { Meteor } from 'meteor/meteor';
import PushNotifications from 'node-pushnotifications';

const settings = {
	gcm: {
		id: 'AIzaSyDHnxk17tUhiaygPC2VcLJSHgM9ryxq-xY',
	},
	// apn: {
	//     token: {
	//         key: './certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
	//         keyId: 'ABCD',
	//         teamId: 'EFGH',
	//     },
	//     production: false // true for APN production environment, false for APN sandbox environment,
	// }
};

const push = new PushNotifications(settings);

export function sendPush({ title, body, userId }) {
	if (!userId) {
		return console.error('Cannot send push without userId');
	}

	const data = {
		title,
		topic: 'topic', // REQUIRED for iOS (apn and gcm)
		body,
	};

	const user = Meteor.users.findOne({ _id: userId, 'services.pushTokens.0': { $exists: 1 } }, { fields: { 'services.pushTokens': 1 } });

	if (!user) {
		return;
	}

	push.send(user.services.pushTokens, data, (err, result) => {
		if (err) {
			console.log('Push error:', { err });
		} else {
			console.log('Push sent:', JSON.stringify({ result }, null, 2));
		}
	});
}

// Meteor.setTimeout(function() {
// 	sendPush({
// 		title: 'asd',
// 		body: 'body',
// 		userId: 'TfhfDaTnD5Pa9cmuv',
// 	});
// }, 5000);
