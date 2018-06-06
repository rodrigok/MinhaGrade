import './Layout.html';

import React, { Component } from 'react';
import {Router} from 'meteor/iron:router';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {
	Menu,
	Layout
} from 'antd';


import { render } from 'react-dom';

class MenuComponent extends Component {
	static propTypes = {
		user: PropTypes.object
	}

	state = {}

	constructor() {
		super();
	}

	handleClick(e) {
		Router.go(e.key);
	}

	renderAdminMenu() {
		const {user} = this.props;
		if (user && user.admin) {
			return <Menu.Item key='calendars'>Editar Calendários</Menu.Item>;
		}
	}

	render() {
		return (
			<Layout.Header>
				<div className='logo' />
				<Menu
					theme='light'
					mode='horizontal'
					// defaultSelectedKeys={['2']}
					style={{ lineHeight: '64px' }}
					onClick={this.handleClick}
				>
					<Menu.Item key='/course/si'>Curso</Menu.Item>
					<Menu.Item key='/calendar/2018-2'>Calendario</Menu.Item>
					{this.renderAdminMenu()}
				</Menu>
			</Layout.Header>
		);
	}
}

const MenuComponentWithTracking = withTracker(() => {
	return {
		user: Meteor.user()
	};
})(MenuComponent);

Template.Layout.onRendered(() => {
	render(<MenuComponentWithTracking />, document.getElementById('render-menu'));
});


// Template.Layout.helpers({
// 	isAdmin() {
// 		return Meteor.user() && Meteor.user().admin === true;
// 	},

// 	calendars() {
// 		return Calendar.find();
// 	}
// });


// Template.Layout.onRendered(() => $('.menu .ui.dropdown').dropdown());
