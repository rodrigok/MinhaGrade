import _ from 'meteor/underscore';
import {Grade} from '../../lib/collections';
import {getItemOfCourse} from '../lib/getItemOfCourse';
import {Router} from 'meteor/iron:router';
import './Grade.html';

Template.Grade.helpers({
	grade() {
		let grade = Session.get('grade').toUpperCase();
		if (['SI', 'TSI'].includes(!grade)) {
			grade = 'SI';
		}

		const query = {};
		query[`code.${ grade }`] = {$exists: true};

		const sort = {};
		sort[`semester.${ grade }`] = 1;
		sort[`code.${ grade }`] = 1;

		return Grade.find(query, {sort});
	},

	canEdit() {
		return (Meteor.user() != null) && (Router.current().params.email == null);
	},

	isSelected(status) {
		const currentStatus = Session.get('grade-filter-status') || 'all';
		if (status === currentStatus) {
			return {
				selected: true
			};
		}
	},

	course() {
		return Router.current().params.course;
	},

	myEmail() {
		if (Router.current().params.email != null) {
			return Router.current().params.email;
		}

		return Meteor.user().emails[0].address;
	},

	url() {
		let { email } = Router.current().params;
		if (email == null) { email = Meteor.user().emails[0].address; }
		const params = Object.assign({email}, Router.current().params);

		return Router.url('my', params, params);
	},

	percentageDone() {
		let user = Meteor.user();
		if (Router.current().params.email != null) {
			user = Meteor.users.findOne({'emails.address': Router.current().params.email});
		}

		if (user == null) {
			return;
		}

		let gradeCode = Session.get('grade').toUpperCase();
		if (['SI', 'TSI'].includes(!gradeCode)) {
			gradeCode = 'SI';
		}

		const query = {};
		query[`code.${ gradeCode }`] = {$exists: true};
		const grade = Grade.find(query).fetch();

		let total = 0;
		let done = 0;
		let doing = 0;
		let electiveMax = 0;

		if (gradeCode === 'SI') {
			electiveMax = 1;
		}

		for (let item of Array.from(grade)) {
			item = getItemOfCourse(item);
			if ((item.semester !== 'E') || (electiveMax-- > 0)) {
				total++;
				if (user && user.grade && user.grade[item._id] === 'done') {
					done++;
					doing++;
				} else if (user && user.grade && user.grade[item._id] === 'doing') {
					doing++;
				}
			}
		}

		return {
			percentageDone: Math.round((100 / total) * done),
			percentageDoing: Math.round((100 / total) * doing),
			total,
			done,
			doing
		};
	},

	getItemOfCourse() {
		return getItemOfCourse(this);
	}
});


Template.Grade.events({
	'change th > select'(e) {
		let status = $(e.target).val();

		if (status === 'all') {
			status = undefined;
		}

		const route = Router.current();

		const { query } = route.params;
		if (status != null) {
			query.status = status;
		} else {
			delete query.status;
		}

		return Router.go(route.route.getName(), route.params, {query});
	},

	'click input.autoselect'(e) {
		return $(e.target).select();
	}
});
