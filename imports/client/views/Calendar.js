import {Calendar, Grade} from '../../lib/collections';
import {getItemOfCourse} from '../lib/getItemOfCourse';
import './Calendar.html';

Template.Calendar.helpers({
	calendar() {
		let grade = Session.get('grade') || 'SI';
		grade = grade.toUpperCase();

		const calendar = {};

		const calendarRecord = Calendar.findOne();
		const calendarGrade = calendarRecord.grade;

		for (const calendarGradeItem of Array.from(calendarGrade)) {
			const query =
				{_id: calendarGradeItem._id};

			query[`code.${ grade }`] = {$exists: true};
			const gradeItem = getItemOfCourse(Grade.findOne(query));

			if (gradeItem == null) {
				continue;
			}

			const shift = `s${ calendarGradeItem.shift }`;

			if (calendar[shift] == null) { calendar[shift] = {}; }

			if (calendar[shift][gradeItem.semester] == null) { calendar[shift][gradeItem.semester] = {}; }

			const day = `d${ calendarGradeItem.day }`;

			if (calendar[shift][gradeItem.semester][day] == null) { calendar[shift][gradeItem.semester][day] = []; }

			calendar[shift][gradeItem.semester][day].push({
				gradeItem,
				calendarItem: calendarGradeItem,
				calendar: calendarRecord
			});
		}

		Object.values(calendar).forEach(([key, calendarItem]) => {
			calendar[key] = Object.values(calendarItem).map(([key, value]) => {
				return {semester: key, value};
			});
		});

		return calendar;
	}
});
