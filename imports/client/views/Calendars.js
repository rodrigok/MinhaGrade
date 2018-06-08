import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Calendar } from '../../lib/collections';
import {
	Table,
	Divider,
	Popconfirm,
	Button
} from 'antd';

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
						<Link to={`/calendars/${ record._id }`}>Editar</Link>

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
					rowKey='_id'
					pagination={false}
				/>
			</div>
		);
	}
}

export default withTracker(() => {
	return {
		user: Meteor.user(),
		data: Calendar.find().fetch()
	};
})(Calendars);
