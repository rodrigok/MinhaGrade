import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { EditableTableComponent } from '../components/EditableTable';

import {
	Icon
} from 'antd';

class Calendars extends EditableTableComponent {

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
			}
		}
	`),
	graphql(gql` mutation removeCalendar($_id: String!) { removeCalendar(_id: $_id) }`, { name: 'removeMutation' }),
	graphql(gql` mutation createCalendar($name: String!) { createCalendar(name: $name) }`, { name: 'createMutation' }),
	graphql(gql` mutation updateCalendar($_id: String! $name: String!) { updateCalendar(_id: $_id name: $name) }`, { name: 'updateMutation' })
)(Calendars);
