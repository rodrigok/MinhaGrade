import './CalendarEdit.html';

Template.CalendarEdit.helpers({
	calendar() {
		const calendar = Calendar.findOne({_id: Router.current().params.calendarName});

		if (calendar.grade == null) { calendar.grade = []; }

		calendar.grade = _.sortBy(calendar.grade, 'day');
		calendar.grade = _.sortBy(calendar.grade, 'shift');

		return calendar;
	},

	grade() {
		return Grade.find();
	},

	getGradeNames(_id) {
		const grade = Grade.findOne(_id);
		const names = [];
		for (let key in grade.name) {
			const name = grade.name[key];
			names.push(name);
		}

		return names;
	},

	getNames(item) {
		const names = [];
		for (let key in item.code) {
			const value = item.code[key];
			names.push(item.name[key]);
		}

		return names.join(' | ');
	},

	shifts() {
		const days = [{
			name: 'Segunda',
			day: '2'
		}
		, {
			name: 'Terça',
			day: '3'
		}
		, {
			name: 'Quarta',
			day: '4'
		}
		, {
			name: 'Quinta',
			day: '5'
		}
		, {
			name: 'Sexta',
			day: '6'
		}
		, {
			name: 'Sábado',
			day: '7'
		}
		];

		return [{
			name: 'Noite',
			shift: '3',
			days
		}
		, {
			name: 'Vespertino',
			shift: '5',
			days
		}
		, {
			name: 'Tarde',
			shift: '2',
			days
		}
		, {
			name: 'Manhã',
			shift: '1',
			days
		}
		];
	},

	getShift(shift) {
		shift = String(shift);
		const shifts = {
			'0': 'EAD',
			'1': 'Manhã',
			'2': 'Tarde',
			'3': 'Noite',
			'5': 'Vespertino'
		};

		return shifts[shift];
	},

	getDay(day) {
		day = String(day);
		const days = {
			'0': 'EAD',
			'2': 'Segunda',
			'3': 'Terça',
			'4': 'Quarta',
			'5': 'Quinta',
			'6': 'Sexta',
			'7': 'Sábado'
		};

		return days[day];
	}});


Template.CalendarEdit.onRendered(() => $('.dropdown').dropdown());

Template.CalendarEdit.events({
	'click .add-calendar-item'() {
		const shiftEl = $('.shift .item.selected');
		const subjectEl = $('.subject .item.selected');

		if ((shiftEl.data('day') != null) && (subjectEl.data('id') != null)) {
			const day = shiftEl.data('day');
			const shift = shiftEl.data('shift');
			const gradeItemId = subjectEl.data('id');

			return Meteor.call('addItemToCalendar', Router.current().params.calendarName, gradeItemId, shift, day);
		}
	},

	'click .remove-item'() {
		return Meteor.call('removeItemFromCalendar', Router.current().params.calendarName, this._id, this.shift, this.day);
	},

	'blur .teacher'(e) {
		const input = e.target;
		const value = input.value.trim();
		if (value !== this.teacher) {
			return Meteor.call('setTeacherInCalendarItem', Router.current().params.calendarName, this._id, this.shift, this.day, value);
		}
	}
});
