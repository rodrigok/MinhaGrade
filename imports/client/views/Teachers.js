import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Teachers } from '../../lib/collections';
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

class TeachersComponent extends Component {
	static propTypes = {
		data: PropTypes.any
	}

	state = {}

	errors = {
		'teacher-name-already-exists': 'Professor já existente'
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
								<a href='javascript:;' onClick={() => this.saveTeacher()}>
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
						placeholder='Nome do professor'
						onPressEnter={() => this.saveTeacher()}
					/>;
				}

				return text;
			}
		}];

		this.state = {
			columns
		};
	}

	saveTeacher() {
		const name = this.state.editingName;
		const _id = this.state.editing;
		if (!name.trim()) {
			return;
		}

		const cb = (error) => {
			if (error) {
				return message.error(this.errors[error.error] || error.error);
			}

			this.setState({
				editing: _id === 'new' ? 'new' : undefined,
				editingName: ''
			});
		};

		if (_id === 'new') {
			return Meteor.call('createTeacher', { name }, cb);
		}

		return Meteor.call('updateTeacher', { _id, name }, cb);
	}

	onDelete(_id) {
		return Meteor.call('removeTeacher', { _id });
	}

	handleAdd = () => {
		this.setState({
			editing: 'new',
			editingName: ''
		});
	}

	render() {
		let data = this.props.data;
		if (this.state.editing === 'new') {
			data = data.concat([{
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
					dataSource={data}
					columns={this.state.columns}
					rowKey='_id'
					pagination={false}
				/>
			</React.Fragment>
		);
	}
}

export default withTracker(() => {
	return {
		user: Meteor.user(),
		data: Teachers.find().fetch()
	};
})(TeachersComponent);
