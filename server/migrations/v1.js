import { Migrations } from 'meteor/percolate:migrations';
import GradeModel from '../api/models/grade';

Migrations.add({
	version: 1,
	up() {
		const courses = JSON.parse(Assets.getText('courses.json'));

		GradeModel.remove({});

		return Array.from(courses).map((item) =>
			GradeModel.insert(item));
	},
});
