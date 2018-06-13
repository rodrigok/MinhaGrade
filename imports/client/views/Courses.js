import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import {
	Table,
	Divider,
	Popconfirm,
	Button,
	Input,
	Icon,
	Tooltip,
	message
} from 'antd';

class CoursesComponent extends Component {
	static propTypes = {
		data: PropTypes.object,
		createCourse: PropTypes.func,
		updateCourse: PropTypes.func,
		removeCourse: PropTypes.func
	}

	state = {}

	errors = {
		'Course name already exists': 'Curso já existente'
	}

	constructor() {
		super();

		const columns = [{
			title: 'Ações',
			key: 'actions',
			width: 80,
			render: (text, record) => {
				if (record._id === this.state.editing) {
					return (
						<span>
							<Tooltip title='Cancelar (ESC)'>
								<a href='javascript:;' onClick={() => this.setState({ editing: undefined })}>
									<Icon type='close-circle'/>
								</a>
							</Tooltip>

							<Divider type='vertical' />

							<Tooltip title='Salvar (ENTER)'>
								<a href='javascript:;' onClick={() => this.saveData()}>
									<Icon type='check-circle'/>
								</a>
							</Tooltip>
						</span>
					);
				}

				return (
					<span>
						<Tooltip title='Editar'>
							<a href='javascript:;' onClick={() => this.setState({ editing: record._id, editingName: record.name })}>
								<Icon type='edit'/>
							</a>
						</Tooltip>

						<Divider type='vertical' />

						<Tooltip title='Remover'>
							<Popconfirm title='Deseja remover?' onConfirm={() => this.onDelete(record._id)}>
								<a href='javascript:;'>
									<Icon type='delete'/>
								</a>
							</Popconfirm>
						</Tooltip>
					</span>
				);
			}
		}, {
			title: 'Nome',
			dataIndex: 'name',
			render: (text, record) => {
				if (record._id === this.state.editing) {
					return <Input
						type='text'
						autoFocus
						onKeyDown={(e) => e.keyCode === 27 && this.setState({ editing: undefined })}
						value={this.state.editingName}
						onChange={(value) => this.setState({ editingName: value.target.value })}
						placeholder='Nome do curso'
						onPressEnter={() => this.saveData()}
					/>;
				}

				return text;
			}
		}];

		this.state = {
			columns
		};
	}

	saveData() {
		const name = this.state.editingName;
		const _id = this.state.editing;
		if (!name.trim()) {
			return;
		}

		const error = (error) => {
			window.a = error;
			if (error) {
				error.graphQLErrors.forEach(e => message.error(this.errors[e.message] || e.message));
			}
		};

		const success = () => {
			this.props.data.refetch();

			this.setState({
				editing: _id === 'new' ? 'new' : undefined,
				editingName: ''
			});
		};

		if (_id === 'new') {
			return this.props.createCourse({
				variables: {
					name
				}
			}).then(success).catch(error);
		}

		return this.props.updateCourse({
			variables: {
				_id,
				name
			}
		}).then(success).catch(error);
	}

	onDelete(_id) {
		this.props.removeCourse({
			variables: {
				_id
			}
		}).then(() => {
			this.props.data.refetch();
		});
	}

	handleAdd = () => {
		this.setState({
			editing: 'new',
			editingName: ''
		});
	}

	render() {
		let { data: { courses } } = this.props;

		if (this.state.editing === 'new') {
			courses = courses.concat([{
				_id: 'new'
			}]);
		}
		return (
			<React.Fragment>
				<Button onClick={this.handleAdd} type='primary' style={{ marginBottom: 16 }}>
					Adicionar
				</Button>

				<Table
					bordered
					dataSource={courses}
					columns={this.state.columns}
					rowKey='_id'
					pagination={false}
				/>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(gql`
		query {
			courses {
				_id
				name
			}
			user {
				_id
				grade
				calendar
			}
		}
	`),
	graphql(gql` mutation removeCourse($_id: String!) { removeCourse(_id: $_id) }`, { name: 'removeCourse' }),
	graphql(gql` mutation createCourse($name: String!) { createCourse(name: $name) }`, { name: 'createCourse' }),
	graphql(gql` mutation updateCourse($_id: String! $name: String!) { updateCourse(_id: $_id name: $name) }`, { name: 'updateCourse' })
)(CoursesComponent);
