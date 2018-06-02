Template.CalendarItem.helpers({
	style() {
		const user = Meteor.user();

		const styles = [];

		let itemStatus = __guard__(user != null ? user.grade : undefined, x => x[this.gradeItem._id]);
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

		if ((user == null)) {
			return false;
		}

		return (user.grade != null ? user.grade[this.gradeItem._id] : undefined) !== 'done';
	},

	intereseted() {
		const user = Meteor.user();
		const key = `${this.calendarItem.shift}${this.calendarItem.day}-${this.gradeItem._id}`;
		return __guard__(__guard__(user != null ? user.calendar : undefined, x1 => x1[this.calendar._id]), x => x.indexOf(key)) > -1;
	}
});


Template.CalendarItem.events({
	'click button.remove-interest'(e) {
		return Meteor.call('updateCalendarItemInterest', this.calendar._id, this.gradeItem._id, this.calendarItem.shift, this.calendarItem.day, false);
	},

	'click button.mark-interest'(e) {
		return Meteor.call('updateCalendarItemInterest', this.calendar._id, this.gradeItem._id, this.calendarItem.shift, this.calendarItem.day, true);
	}
});
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}