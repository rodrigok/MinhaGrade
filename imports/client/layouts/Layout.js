import {Calendar} from '../../lib/collections';
import './Layout.html';

Template.Layout.helpers({
	isAdmin() {
		return Meteor.user() && Meteor.user().admin === true;
	},

	calendars() {
		return Calendar.find();
	}
});


Template.Layout.onRendered(() => $('.menu .ui.dropdown').dropdown());
