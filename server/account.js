import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import Users from './api/models/user';

Accounts.onCreateUser((options, user) => {
	user.profile = options.profile ? options.profile : { };

	if (user.services.facebook) {
		// user.profile.firstname = user.services.facebook.first_name
		// user.profile.lastname = user.services.facebook.last_name
		user.emails = [{ address: user.services.facebook.email, verified: true }];
	}

	if (user.emails.length > 0 && !user.emails[0].verified) {
		Meteor.setTimeout(function() {
			Accounts.sendVerificationEmail(user._id);
		}, 2 * 1000);
	}

	return user;
});

const orig_updateOrCreateUserFromExternalService = Accounts.updateOrCreateUserFromExternalService;

Accounts.updateOrCreateUserFromExternalService = function(serviceName, serviceData = {}, ...args) {
	if (serviceName !== 'facebook') {
		return;
	}

	if (serviceData.email) {
		const user = Users.findOneByEmailAddress(serviceData.email);
		if (user != null) {
			Users.setServiceId(user._id, serviceName, serviceData.id);
			Users.setEmailVerified(user._id, serviceData.email);
		}
	}

	return orig_updateOrCreateUserFromExternalService.call(this, serviceName, serviceData, ...args);
};
