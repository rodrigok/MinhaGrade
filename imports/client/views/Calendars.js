import React, { Component } from 'react';
import {Router} from 'meteor/iron:router';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Calendar} from '../../lib/collections';
import './Calendars.html';
import {
	Table,
	Divider,
	Popconfirm,
	Button
} from 'antd';


import { render } from 'react-dom';

class Calendars extends Component {
	static propTypes = {
		data: PropTypes.any
	}

	state = {}

	constructor() {
		super();

		const columns = [{
			title: 'Ações',
			key: 'actions',
			width: 150,
			render: (text, record) => {
				return (
					<span>
						<a href='javascript:;' onClick={() => Router.go('calendarEdit', {calendarName: record._id})}>Editar</a>
						<Divider type='vertical' />
						<Popconfirm title='Deseja deletar?' onConfirm={() => this.onDelete(record._id)}>
							<a href='javascript:;'>Deletar</a>
						</Popconfirm>
					</span>
				);
			}
		}, {
			title: 'Nome',
			dataIndex: '_id'
		}];

		this.state = {
			columns
		};
	}

	onDelete(_id) {
		return Meteor.call('removeCalendar', _id);
	}

	handleAdd() {
		const value = prompt('Informe um nome', (new Date).getFullYear());

		if ((value != null) && (value.trim() !== '')) {
			return Meteor.call('createCalendar', value);
		}
	}

	render() {
		return (
			<div>
				<Button onClick={this.handleAdd} type='primary' style={{ marginBottom: 16 }}>
					Adicionar
				</Button>

				<Table
					dataSource={this.props.data}
					columns={this.state.columns}
					pagination={false}
				/>
			</div>
		);
	}
}

const CalendarsWithTracking = withTracker(() => {
	return {
		user: Meteor.user(),
		data: Calendar.find().fetch()
	};
})(Calendars);

Template.Calendars.onRendered(() => {
	render(<CalendarsWithTracking />, document.getElementById('render-calendars'));
});



// Template.Calendars.helpers({
// 	calendars() {
// 		return Calendar.find();
// 	}
// });

// Template.Calendars.events({
// 	'click .add-calendar'() {
// 		const value = prompt('Informe um nome', (new Date).getFullYear());

// 		if ((value != null) && (value.trim() !== '')) {
// 			return Meteor.call('createCalendar', value);
// 		}
// 	},

// 	'click .remove-calendar'() {
// 		return Meteor.call('removeCalendar', this._id);
// 	}
// });
