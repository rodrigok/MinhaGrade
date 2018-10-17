import { Migrations } from 'meteor/percolate:migrations';
import GradeModel from '../api/models/grade';
import CourseModel from '../api/models/course';
import TeacherModel from '../api/models/teacher';
import UserModel from '../api/models/user';

Migrations.add({
	version: 1,
	up() {
		const grade = JSON.parse(Assets.getText('grade.json'));

		GradeModel.remove({});

		return Array.from(grade).map((item) => GradeModel.insert(item));
	},
});

Migrations.add({
	version: 3,
	up() {
		return;
	},
});

Migrations.add({
	version: 4,
	up() {
		const courses = JSON.parse(Assets.getText('courses.json'));

		CourseModel.remove({});

		Array.from(courses).map((item) => CourseModel.insert(item));

		const teachers = JSON.parse(Assets.getText('teachers.json'));

		TeacherModel.remove({});

		Array.from(teachers).map((item) => TeacherModel.insert(item));

		UserModel.update({
			'profile.course': {$exists: false}
		}, {
			$set: {
				'profile.course': 'SI'
			}
		}, {multi: true});
	},
});
