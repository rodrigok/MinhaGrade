import React from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { EditableTableComponent } from '/client/components/EditableTable';

import {
	Input,
	Icon,
	message
} from 'antd';


class CoursesComponent extends EditableTableComponent {
	constructor() {
		super();

		this.state.columns.push({
			title: '# Eletivas',
			dataIndex: 'elective',
			width: 120,
			render: (text, record) => {
				if (record._id === this.state.editing) {
					return <Input
						type='number'
						onKeyDown={(e) => e.keyCode === 27 && this.setState({ editing: undefined })}
						value={this.state.editingElective}
						onChange={(value) => this.setState({ editingElective: value.target.value })}
						placeholder=''
						onPressEnter={() => this.save()}
					/>;
				}

				return text || '0';
			}
		});
	}

	save() {
		const elective = this.state.editingElective;
		const name = this.state.editingName;
		const _id = this.state.editing;
		if (!name.trim()) {
			return;
		}

		const error = (error) => {
			if (error) {
				error.graphQLErrors.forEach(e => message.error(this.errors[e.message] || e.message));
			}
		};

		const success = () => {
			this.props.data.refetch();

			this.setState({
				editing: _id === 'new' ? 'new' : undefined,
				editingName: '',
				editingElective: undefined
			});
		};

		if (_id === 'new') {
			return this.props.createMutation({
				variables: {
					name,
					elective
				}
			}).then(success).catch(error);
		}

		return this.props.updateMutation({
			variables: {
				_id,
				name,
				elective
			}
		}).then(success).catch(error);
	}

	getEditButtonComponent(record) {
		return (
			<a href='javascript:;' onClick={() => this.setState({ editing: record._id, editingName: record.name, editingElective: record.elective })}>
				<Icon type='edit'/>
			</a>
		);
	}
}

export default compose(
	graphql(gql`
		query {
			records: courses {
				_id
				name
				elective
			}
		}
	`),
	graphql(gql` mutation removeCourse($_id: String!) { removeCourse(_id: $_id) }`, { name: 'removeMutation' }),
	graphql(gql` mutation createCourse($name: String! $elective: Float!) { createCourse(name: $name elective: $elective) }`, { name: 'createMutation' }),
	graphql(gql` mutation updateCourse($_id: String! $name: String! $elective: Float!) { updateCourse(_id: $_id name: $name elective: $elective) }`, { name: 'updateMutation' })
)(CoursesComponent);

