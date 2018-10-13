import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { client } from './ApolloClientProvider';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';
import {
	Layout
} from 'antd';

import GradeComponent from './views/Grade';
import CalendarComponent from './views/Calendar';
import CalendarsComponent from './views/Calendars';
import CalendaEditsComponent from './views/CalendarEdit';
import TeachersComponent from './views/Teachers';
import CoursesComponent from './views/Courses';
import MenuComponent from './components/Menu';

class MainRouter extends Router {
	constructor(props) {
		super();

		props.data.subscribeToMore({
			document: gql`
				subscription grade {
					grade {
						_id,
						userStatus
					}
				}
			`
		});
	}

	render() {
		const { data } = this.props;

		return (
			<Router>
				<Layout>
					<Layout.Header>
						<MenuComponent routeData={data} />
					</Layout.Header>
					<Layout.Content>
						<div style={{ background: '#fff', padding: 24 }}>
							<Route exact path='/' component={GradeComponent}/>
							<Route exact path='/course' component={GradeComponent}/>
							<Route exact path='/shared/:userId' component={GradeComponent}/>
							<Route exact path='/calendar' component={CalendarComponent}/>
							<Route exact path='/calendars' component={CalendarsComponent}/>
							<Route exact path='/calendars/:calendarName' component={CalendaEditsComponent}/>
							<Route exact path='/teachers' component={TeachersComponent}/>
							<Route exact path='/courses' component={CoursesComponent}/>
						</div>
					</Layout.Content>
				</Layout>
			</Router>
		);
	}
}

MainRouter = graphql(gql`
	query {
		courses {
			_id
			name
			elective
		}
		user {
			_id
			admin
			profile {
				name
				course {
					_id
					name
				}
			}
			mainEmail {
				address
			}
		}
		calendar {
			_id
		}
	}
`)(MainRouter);


class App extends Component {
	render() {
		return (
			<ApolloProvider client={client}>
				<MainRouter />
			</ApolloProvider>
		);
	}
}

Meteor.startup(() => {
	render(<App />, document.getElementById('app'));
});

export const ApolloClient = client;
