import './CalendarItem.html';

Template.CalendarItem.helpers({
	style() {
		const user = Meteor.user();

		const styles = [];

		let itemStatus = user && user.grade && user.grade[this.gradeItem._id];
		if (itemStatus == null) { itemStatus = 'pending'; }

		switch (itemStatus) {
			case 'done':
				styles.push('color: lightgray');
				break;
			case 'doing':
				styles.push('color: orange');
				break;
		}

		return styles.join('; ');
	},

	canMarkInterrest() {
		const user = Meteor.user();

		if (user == null) {
			return false;
		}

		return (user.grade != null ? user.grade[this.gradeItem._id] : undefined) !== 'done';
	},

	intereseted() {
		const user = Meteor.user();
		const key = `${ this.calendarItem.shift }${ this.calendarItem.day }-${ this.gradeItem._id }`;
		return user && user.calendar && user.calendar[this.calendar._id] && user.calendar[this.calendar._id].indexOf(key) > -1;
	}
});


Template.CalendarItem.events({
	'click button.remove-interest'() {
		return Meteor.call('updateCalendarItemInterest', this.calendar._id, this.gradeItem._id, this.calendarItem.shift, this.calendarItem.day, false);
	},

	'click button.mark-interest'() {
		return Meteor.call('updateCalendarItemInterest', this.calendar._id, this.gradeItem._id, this.calendarItem.shift, this.calendarItem.day, true);
	}
});
