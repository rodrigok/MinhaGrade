import { Session } from 'meteor/session';
import { Match } from 'meteor/check';

export const getItemOfCourse = function(item) {
	let grade = Session.get('grade') || 'SI';
	grade = grade.toUpperCase();

	if (!Match.test(item, Object)) {
		return item;
	}

	return {
		_id: item._id,
		semester: (item.semester != null ? item.semester[grade] : undefined),
		code: (item.code != null ? item.code[grade] : undefined),
		name: (item.name != null ? item.name[grade] : undefined),
		requirement: (item.requirement != null ? item.requirement[grade] : undefined),
		credit: item.credit,
		workload: item.workload,
		description: item.description
	};
};
