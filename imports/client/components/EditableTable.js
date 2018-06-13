import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

export class EditableTableComponent extends Component {
	static propTypes = {
		data: PropTypes.object,
		removeMutation: PropTypes.func,
		createMutation: PropTypes.func,
		updateMutation: PropTypes.func
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
							{this.getEditButtonComponent(record)}
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
						placeholder='Nome'
						onPressEnter={() => this.save()}
					/>;
				}

				return text;
			}
		}];

		this.state = {
			columns
		};
	}

	getEditButtonComponent(record) {
		return (
			<a href='javascript:;' onClick={() => this.setState({ editing: record._id, editingName: record.name })}>
				<Icon type='edit'/>
			</a>
		);
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
			return this.props.createMutation({
				variables: {
					name
				}
			}).then(success).catch(error);
		}

		return this.props.updateMutation({
			variables: {
				_id,
				name
			}
		}).then(success).catch(error);
	}

	onDelete(_id) {
		this.props.removeMutation({
			variables: {
				_id
			}
		}).then(() => {
			this.props.data.refetch();
		});
	}

	onAdd = () => {
		this.setState({
			editing: 'new',
			editingName: ''
		});
	}

	render() {
		let { data: { records } } = this.props;
		const { data: { loading } } = this.props;

		if (this.state.editing === 'new') {
			records = records.concat([{
				_id: 'new'
			}]);
		}

		return (
			<React.Fragment>
				<Button onClick={this.onAdd} type='primary' style={{ marginBottom: 16 }}>
					Adicionar
				</Button>

				<Table
					bordered
					loading={loading}
					dataSource={records}
					columns={this.state.columns}
					rowKey='_id'
					pagination={false}
				/>
			</React.Fragment>
		);
	}
}
