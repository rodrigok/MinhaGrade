import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import {
	Menu,
	Dropdown,
	Icon,
	message,
	Tooltip,
	Tag,
	Table,
	Progress
} from 'antd';

const Status = {
	pending: 'Pendente',
	doing: 'Cursando',
	done: 'Concluído'
};

class GradeComponent extends Component {
	static propTypes = {
		data: PropTypes.object,
		user: PropTypes.object,
		updateGradeItem: PropTypes.func
	}

	state = {}

	updateGradeItem = (_id, status) => {
		this.props.updateGradeItem({
			variables: {
				_id,
				status
			}
		}).then(() => {
			message.success('Status alterado');
		});
	}

	getColumns = () => {
		const { user: { user } } = this.props;

		const columns = [{
			title: 'Semestre / Código',
			dataIndex: 'semester',
			render: (text, record) => (
				`${ record.semester } / ${ record.code }`
			),
			sortOrder: 'descend',
			sorter: (a, b) => {
				const aText = `${ a.semester } / ${ a.code }`;
				const bText = `${ b.semester } / ${ b.code }`;
				if (aText > bText) {
					return -1;
				}
				if (aText < bText) {
					return 1;
				}
				return 0;
			}
		}, {
			title: 'Nome',
			dataIndex: 'name'
		}, {
			title: 'Dependencias',
			dataIndex: 'requirement',
			render: (requirements) => {
				return requirements.map(requirement => {
					const style = {
						color: '#f50'
					};

					switch (requirement.userStatus) {
						case 'done':
							style.color = '#d3d3d3';
							break;
						case 'doing':
							style.color = '#ffa500';
							break;
					}

					if (requirement.name) {
						return <Tooltip key={requirement.code} title={`${ requirement.name } - Semestre ${ requirement.semester }`}>
							<Tag color={style.color}>{requirement.code}</Tag>
						</Tooltip>;
					}

					return <Tag key={requirement.code} color={style.color}>{requirement.code}</Tag>;
				});
			}
		}, {
			title: 'Créditos / Carga Horária',
			dataIndex: 'credit',
			render: (text, record) => (
				`${ record.credit } / ${ record.workload }`
			)
		}];

		if (user) {
			columns.unshift({
				title: 'Status',
				dataIndex: 'status',
				filters: [{
					text: Status.pending,
					value: 'pending'
				}, {
					text: Status.doing,
					value: 'doing'
				}, {
					text: Status.done,
					value: 'done'
				}],
				onFilter: (value, record) => {
					const { user: { user } } = this.props;

					if (!user) {
						return;
					}

					return record.userStatus.includes(value);
				},
				render: (text, record) => {
					const { user: { user } } = this.props;

					if (!user) {
						return;
					}

					const status = record.userStatus;

					const onClick = ({ key }) => {
						message.info(`Alterando status para ${ Status[key] }`);
						return this.updateGradeItem(record._id, key);
					};

					const menu = (
						<Menu onClick={onClick}>
							<Menu.Item key={'pending'} disabled={'pending' === status}>{Status.pending}</Menu.Item>
							<Menu.Item key={'doing'} disabled={'doing' === status}>{Status.doing}</Menu.Item>
							<Menu.Item key={'done'} disabled={'done' === status}>{Status.done}</Menu.Item>
						</Menu>
					);

					const style = {};
					switch (status) {
						case 'done':
							style.color = 'lightgray';
							break;
						case 'doing':
							style.color = 'orange';
							break;
					}

					return <Dropdown overlay={menu}>
						<a className='ant-dropdown-link' style={style}>
							{Status[status]} <Icon type='down' />
						</a>
					</Dropdown>;
				}
			});
		}

		return columns;
	}

	onRow = (record) => {
		const style = {};

		if (record.semester === 'E') {
			style.backgroundColor = '#DBEAFF';
		} else if ((record.semester % 2) === 0) {
			style.backgroundColor = '#f1f1f1';
		}

		switch (record.userStatus) {
			case 'done':
				style.color = 'lightgray';
				break;
			case 'doing':
				style.color = 'orange';
				break;
		}

		return {
			style
		};
	}

	percentageDone = () => {
		const { data: { grades, loading }, user: { user } } = this.props;

		if (loading) {
			return;
		}

		const electiveMax = (user && user.profile && user.profile.course && user.profile.course.elective) || 0;

		const total = grades.filter((item) => item.semester !== 'E').length + electiveMax;

		const electiveDone = Math.min(grades.filter((item) => item.semester === 'E' && item.userStatus === 'done').length, electiveMax);
		const electiveDoing = Math.min(grades.filter((item) => item.semester === 'E' && item.userStatus === 'doing').length, electiveMax - electiveDone);

		const done = grades.filter((item) => item.semester !== 'E' && item.userStatus === 'done').length + electiveDone;
		const doing = grades.filter((item) => item.semester !== 'E' && item.userStatus === 'doing').length + electiveDoing;

		const percentageDone = Math.round((100 / total) * done);
		const percentageDoing = Math.round((100 / total) * doing);

		return <Tooltip title={`${ done } concluída(s) + ${ doing } cursando de ${ total }`}>
			<Progress percent={percentageDone+percentageDoing} successPercent={percentageDone} />
		</Tooltip>;
	}

	render() {
		const { data: { error, loading, grades } } = this.props;

		if (error) {
			console.log(error);
			return <p>Error :(</p>;
		}

		return (
			<div>
				{this.percentageDone()}

				<Table
					dataSource={grades}
					loading={loading}
					columns={this.getColumns()}
					pagination={false}
					rowKey='_id'
					expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
					onRow={this.onRow.bind(this)}
				/>
			</div>
		);
	}
}

export default compose(
	graphql(gql`
		query {
			grades {
				_id
				credit
				workload
				code
				name
				semester
				description
				userStatus
				requirement {
					_id
					semester
					code
					name
					userStatus
				}
			}
		}
	`),
	graphql(gql`
		query {
			user {
				_id
				profile {
					course {
						elective
					}
				}
			}
		}
	`, { name: 'user' }),
	graphql(gql`
		mutation updateGradeItem($_id: String! $status: String!) {
			updateGradeItem(_id: $_id, status: $status)
		}
	`, { name: 'updateGradeItem' })
)(GradeComponent);
