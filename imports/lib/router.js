import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { client } from '../api/ApolloClientProvider';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';
import {
	Layout
} from 'antd';

import GradeComponent from '../client/views/Grade';
import CalendarComponent from '../client/views/Calendar';
import CalendarsComponent from '../client/views/Calendars';
import CalendaEditsComponent from '../client/views/CalendarEdit';
import TeachersComponent from '../client/views/Teachers';
import CoursesComponent from '../client/views/Courses';
import MenuComponent from '../client/components/Menu';

class MainRouter extends Router {
	render() {
		return (
			<ApolloProvider client={client}>
				<Router>
					<Layout>
						<Layout.Header>
							<MenuComponent />
						</Layout.Header>
						<Layout.Content>
							<div style={{ background: '#fff', padding: 24 }}>
								<Route exact path='/' component={GradeComponent}/>
								<Route exact path='/course' component={GradeComponent}/>
								<Route exact path='/calendar' component={CalendarComponent}/>
								<Route exact path='/calendars' component={CalendarsComponent}/>
								<Route exact path='/calendars/:calendarName' component={CalendaEditsComponent}/>
								<Route exact path='/teachers' component={TeachersComponent}/>
								<Route exact path='/courses' component={CoursesComponent}/>
							</div>
						</Layout.Content>
					</Layout>
				</Router>
			</ApolloProvider>
		);
	}
}

Meteor.startup(() => {
	render(<MainRouter />, document.body);
});




// Router.configure({
// 	layoutTemplate: 'Layout',
// 	waitOn() {
// 		return [
// 			Meteor.subscribe('Grade'),
// 			Meteor.subscribe('Calendar'),
// 			Meteor.subscribe('userGradeInfo')
// 		];
// 	}});


// Router.route('/', function() {
// 	return this.redirect('/course/si');
// });


// Router.route('/si', function() {
// 	return this.redirect('/course/si');
// });


// Router.route('/tsi', function() {
// 	return this.redirect('/course/tsi');
// });


// Router.route('/course/:course', {
// 	name: 'course',

// 	action() {
// 		const course = this.params.course.toLowerCase();
// 		if (!['si', 'tsi'].includes(course)) {
// 			return this.redirect('/course/si');
// 		}

// 		Session.set('grade', course);

// 		Session.set('grade-filter-status', this.params.query.status);

// 		return this.render('Grade');
// 	},

// 	fastRender: true
// }
// );


// Router.route('/my/:course/:email', {
// 	name: 'my',

// 	waitOn() {
// 		return [
// 			Meteor.subscribe('userGradeInfo', this.params.email)
// 		];
// 	},

// 	action() {
// 		const course = this.params.course.toLowerCase();
// 		if (!['si', 'tsi'].includes(course)) {
// 			return this.redirect(`/course/si/${ this.params.email }`);
// 		}

// 		Session.set('grade', course);

// 		Session.set('grade-filter-status', this.params.query.status);

// 		return this.render('Grade', {
// 			data: {
// 				email: this.params.email
// 			}
// 		}
// 		);
// 	},

// 	fastRender: true
// }
// );


// Router.route('/calendar/:calendarName/:course?', {
// 	name: 'calendar',

// 	waitOn() {
// 		return [
// 			Meteor.subscribe('Calendar', this.params.calendarName)
// 		];
// 	},

// 	action() {
// 		let course = this.params.course || '';
// 		course = course.toLowerCase();
// 		if (!['si', 'tsi'].includes(course)) {
// 			return this.redirect(`/calendar/${ this.params.calendarName }/si`);
// 		}

// 		Session.set('grade', course);

// 		return this.render('Calendar');
// 	},

// 	fastRender: true
// }
// );


// Router.route('/calendars', {
// 	name: 'calendars',

// 	onBeforeAction() {
// 		if (Meteor.user() && Meteor.user().admin !== true) {
// 			return Router.go('/');
// 		}
// 		return this.next();
// 	},

// 	waitOn() {
// 		return [
// 			Meteor.subscribe('Calendar')
// 		];
// 	},

// 	action() {
// 		return this.render('Calendars');
// 	},

// 	fastRender: true
// }
// );


// Router.route('/calendars/:calendarName', {
// 	name: 'calendarEdit',

// 	onBeforeAction() {
// 		if (Meteor.user() && Meteor.user().admin !== true) {
// 			return Router.go('/');
// 		}
// 		return this.next();
// 	},

// 	waitOn() {
// 		return [
// 			Meteor.subscribe('Calendar', this.params.calendarName)
// 		];
// 	},

// 	action() {
// 		return this.render('CalendarEdit');
// 	},

// 	fastRender: true
// });
