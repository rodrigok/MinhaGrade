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
	Layout,
	Modal,
	Form,
	Select
} from 'antd';

import GradeComponent from './views/Grade';
import CalendarComponent from './views/Calendar';
import CalendarsComponent from './views/Calendars';
import CalendaEditsComponent from './views/CalendarEdit';
import TeachersComponent from './views/Teachers';
import CoursesComponent from './views/Courses';
import MenuComponent from './components/Menu';

class MainRouter extends Router {
	state = {}

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

	renderCourseModal() {
		const { data: { user, courses, loading } } = this.props;

		if (loading || !user) {
			return;
		}

		if (user.profile && user.profile.course && user.profile.course._id) {
			return;
		}

		return <Modal
			title='Selecione um curso'
			visible={!this.state.courseModalClosed}
			closable={false}
			cancelButtonProps={{
				hidden: true
			}}
			okButtonProps={{
				disabled: !this.state.courseModalSelected
			}}
			okText='Selecionar'
			onOk={() => {
				Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.course': this.state.courseModalSelected } });
				this.setState({
					courseModalClosed: true
				});
				client.resetStore();
			}}
		>
			<Form onSubmit={this.handleChangeCourse}>
				<Form.Item>
					<Select
						showSearch
						placeholder='Curso'
						onChange={(value) => {
							this.setState({
								courseModalSelected: value
							});
						}}
					>
						{courses.map(course => (
							<Select.Option key={course._id} value={course._id}>{course.name}</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>;
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
							{this.renderCourseModal()}
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
