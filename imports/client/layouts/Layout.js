import './Layout.html';

Template.Layout.helpers({
	isAdmin() {
		return __guard__(Meteor.user(), x => x.admin) === true;
	},

	calendars() {
		return Calendar.find();
	}
});


Template.Layout.onRendered(() => $('.menu .ui.dropdown').dropdown());

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
