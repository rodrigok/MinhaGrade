import {Router} from 'meteor/iron:router';
import {Grade} from '../../lib/collections';
import {getItemOfCourse} from '../lib/getItemOfCourse';
import './GradeItem.html';

Template.GradeItem.onRendered(function() {
	return this.$('div.label').popup({});
});

Template.GradeItem.helpers({
	lineStyle() {
		let user = Meteor.user();
		if (Router.current().params.email != null) {
			user = Meteor.users.findOne({'emails.address': Router.current().params.email});
		}
		const styles = [];

		if (this.semester === 'E') {
			styles.push('background-color: #DBEAFF');
		} else if ((this.semester % 2) === 0) {
			styles.push('background-color: #f1f1f1');
		}

		let itemStatus = user && user.grade && user.grade[this._id];
		if (itemStatus == null) { itemStatus = 'pending'; }

		switch (itemStatus) {
			case 'done':
				styles.push('color: lightgray');
				break;
			case 'doing':
				styles.push('color: orange');
				break;
		}

		const filterStatus = Session.get('grade-filter-status');
		if (filterStatus != null) {
			if (filterStatus !== itemStatus) {
				styles.push('display: none');
			}
		}

		return styles.join('; ');
	},

	isSelected(status) {
		const user = Meteor.user();
		if ((user.grade != null ? user.grade[this._id] : undefined) === status) {
			return {
				selected: true
			};
		}
	},

	getGradeItemByCode(code) {
		const grade = Session.get('grade').toUpperCase();

		const query = {};
		query[`code.${ grade }`] = code;

		return getItemOfCourse(Grade.findOne(query));
	},

	requirementColor(_id) {
		let user = Meteor.user();
		if (Router.current().params.email != null) {
			user = Meteor.users.findOne({'emails.address': Router.current().params.email});
		}
		switch (user && user.grade && user.grade[_id]) {
			case 'done':
				return 'grey';
			case 'doing':
				return 'orange';
			default:
				return 'red';
		}
	},

	canEdit() {
		return (Meteor.user() != null) && (Router.current().params.email == null);
	}
});


Template.GradeItem.events({
	'change select'(e) {
		const status = $(e.target).val();
		return Meteor.call('updateGradeItem', this._id, status);
	},

	'click .grade-item-name'() {
		if (this.description != null) {
			Session.set('modalInfoTitle', this.name);
			Session.set('modalInfoDescription', this.description);
			return Session.set('modalInfoShow', true);
		}
	}
});
