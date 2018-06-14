import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

Meteor.startup(() => Migrations.migrateTo('latest'));

Meteor.methods({
	migrateTo(version) {
		if (!this.userId) {
			return;
		}

		return Migrations.migrateTo(version);
	}
});
