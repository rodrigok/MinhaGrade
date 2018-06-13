import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

class Calendars extends Component {
	static propTypes = {
		data: PropTypes.object,
		removeCalendar: PropTypes.func,
		createCalendar: PropTypes.func,
		updateCalendar: PropTypes.func
	}

	state = {}

	errors = {
		'Name already exists': 'Nome já existente'
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
								<a href='javascript:;' onClick={() => this.save()}>
									<Icon type='check-circle'/>
								</a>
							</Tooltip>
						</span>
					);
				}

				return (
					<span>
						<Tooltip title='Editar'>
							<Link to={`/calendars/${ record._id }`}>
								<Icon type='edit'/>
							</Link>
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
						placeholder='Nome do professor'
						onPressEnter={() => this.save()}
					/>;
				}

				return text || record._id;
			}
		}];

		this.state = {
			columns
		};
	}

	save() {
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
			return this.props.createCalendar({
				variables: {
					name
				}
			}).then(success).catch(error);
		}

		return this.props.updateCalendar({
			variables: {
				_id,
				name
			}
		}).then(success).catch(error);
	}

	onDelete(_id) {
		this.props.removeCalendar({
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
		let { data: { calendars } } = this.props;
		const { data: { loading } } = this.props;
		if (this.state.editing === 'new') {
			calendars = calendars.concat([{
				_id: 'new'
			}]);
		}
		return (
			<div>
				<Button onClick={this.handleAdd} type='primary' style={{ marginBottom: 16 }}>
					Adicionar
				</Button>

				<Table
					bordered
					loading={loading}
					dataSource={calendars}
					columns={this.state.columns}
					rowKey='_id'
					pagination={false}
				/>
			</div>
		);
	}
}


export default compose(
	graphql(gql`
		query {
			calendars {
				_id
				name
			}
		}
	`),
	graphql(gql` mutation removeCalendar($_id: String!) { removeCalendar(_id: $_id) }`, { name: 'removeCalendar' }),
	graphql(gql` mutation createCalendar($name: String!) { createCalendar(name: $name) }`, { name: 'createCalendar' }),
	graphql(gql` mutation updateCalendar($_id: String! $name: String!) { updateCalendar(_id: $_id name: $name) }`, { name: 'updateCalendar' })
)(Calendars);
