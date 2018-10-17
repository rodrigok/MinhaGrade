import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { EditableTableComponent } from '/client/components/EditableTable';

import {
	Icon,
	Switch,
	message,
} from 'antd';

class Calendars extends EditableTableComponent {

	constructor() {
		super();

		this.errors['Another calendar is already active'] = 'Outro calendário já está ativo';

		const error = (error) => {
			if (error) {
				error.graphQLErrors.forEach((e) => message.error(this.errors[e.message] || e.message));
				this.props.data.refetch();
			}
		};

		this.state.columns.push({
			title: 'Ativo',
			dataIndex: 'active',
			width: 80,
			render: (text, { _id }) => <Switch
				checked={text}
				onChange={(value) => {
					this.props.activateCalendar({
						variables: {
							_id,
							active: value,
						},
					}).then(() => {
						this.props.data.refetch();
					}).catch(error);
				}}
			/>,
		});
	}

	getEditButtonComponent(record) {
		return (
			<Link to={`/calendars/${ record._id }`}>
				<Icon type='edit'/>
			</Link>
		);
	}

}

export default compose(
	graphql(gql`
		query {
			records: calendars {
				_id
				name
				active
			}
		}
	`),
	graphql(gql` mutation removeCalendar($_id: String!) { removeCalendar(_id: $_id) }`, { name: 'removeMutation' }),
	graphql(gql` mutation createCalendar($name: String!) { createCalendar(name: $name) }`, { name: 'createMutation' }),
	graphql(gql` mutation updateCalendar($_id: String! $name: String!) { updateCalendar(_id: $_id name: $name) }`, { name: 'updateMutation' }),
	graphql(gql` mutation activateCalendar($_id: String! $active: Boolean) { activateCalendar(_id: $_id active: $active) }`, { name: 'activateCalendar' })
)(Calendars);
