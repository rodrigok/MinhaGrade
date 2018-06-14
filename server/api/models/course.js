import { _BaseModel } from './_Base';

class CourseModel extends _BaseModel {
	constructor() {
		super('courses');
	}
}

export default new CourseModel();
