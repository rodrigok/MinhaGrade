Template.Calendars.helpers({
	calendars() {
		return Calendar.find();
	}
});

Template.Calendars.events({
	'click .add-calendar'() {
		const value = prompt('Informe um nome', (new Date).getFullYear());

		if ((value != null) && (value.trim() !== '')) {
			return Meteor.call('createCalendar', value);
		}
	},

	'click .remove-calendar'() {
		return Meteor.call('removeCalendar', this._id);
	}
});