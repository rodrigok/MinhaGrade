import {Router} from 'meteor/iron:router';

Router.configure({
	layoutTemplate: 'Layout',
	waitOn() {
		return [
			Meteor.subscribe('Grade'),
			Meteor.subscribe('Calendar'),
			Meteor.subscribe('userGradeInfo')
		];
	}});


Router.route('/', function() {
	return this.redirect('/course/si');
});


Router.route('/si', function() {
	return this.redirect('/course/si');
});


Router.route('/tsi', function() {
	return this.redirect('/course/tsi');
});


Router.route('/course/:course', {
	name: 'course',

	action() {
		const course = this.params.course.toLowerCase();
		if (!['si', 'tsi'].includes(course)) {
			return this.redirect('/course/si');
		}

		Session.set('grade', course);

		Session.set('grade-filter-status', this.params.query.status);

		return this.render('Grade');
	},

	fastRender: true
}
);


Router.route('/my/:course/:email', {
	name: 'my',

	waitOn() {
		return [
			Meteor.subscribe('userGradeInfo', this.params.email)
		];
	},

	action() {
		const course = this.params.course.toLowerCase();
		if (!['si', 'tsi'].includes(course)) {
			return this.redirect(`/course/si/${ this.params.email }`);
		}

		Session.set('grade', course);

		Session.set('grade-filter-status', this.params.query.status);

		return this.render('Grade', {
			data: {
				email: this.params.email
			}
		}
		);
	},

	fastRender: true
}
);


Router.route('/calendar/:calendarName/:course?', {
	name: 'calendar',

	waitOn() {
		return [
			Meteor.subscribe('Calendar', this.params.calendarName)
		];
	},

	action() {
		let course = this.params.course || '';
		course = course.toLowerCase();
		if (!['si', 'tsi'].includes(course)) {
			return this.redirect(`/calendar/${ this.params.calendarName }/si`);
		}

		Session.set('grade', course);

		return this.render('Calendar');
	},

	fastRender: true
}
);


Router.route('/calendars', {
	name: 'calendars',

	onBeforeAction() {
		if (Meteor.user() && Meteor.user().admin !== true) {
			return Router.go('/');
		}
		return this.next();
	},

	waitOn() {
		return [
			Meteor.subscribe('Calendar')
		];
	},

	action() {
		return this.render('Calendars');
	},

	fastRender: true
}
);


Router.route('/calendars/:calendarName', {
	name: 'calendarEdit',

	onBeforeAction() {
		if (Meteor.user() && Meteor.user().admin !== true) {
			return Router.go('/');
		}
		return this.next();
	},

	waitOn() {
		return [
			Meteor.subscribe('Calendar', this.params.calendarName)
		];
	},

	action() {
		return this.render('CalendarEdit');
	},

	fastRender: true
});
