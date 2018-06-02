import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Grade } from '../lib/collections';
import { Table } from 'antd';
import { Tag } from 'antd';
import { Tooltip } from 'antd';
import { Menu, Dropdown, Icon, message } from 'antd';
import 'antd/dist/antd.css';

const Status = {
	pending: 'Pendente',
	doing: 'Cursando',
	done: 'Concluído'
};


// App component - represents the whole app
class App extends Component {
	static propTypes = {
		grade: PropTypes.any,
		user: PropTypes.object
	}

	constructor() {
		super();

		this.columns = [{
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
				const user = this.props.user;
				const status = (user && user.grade && user.grade[record._id]) || 'pending';
				return status.includes(value);
			},
			render: (text, record) => {
				const user = this.props.user;
				const status = (user && user.grade && user.grade[record._id]) || 'pending';

				const onClick = ({ key }) => {
					message.info(`Alterando status para ${ Status[key] }`);
					return Meteor.call('updateGradeItem', record._id, key, () => {
						message.success('Status alterado');
					});
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
					<a className='ant-dropdown-link' style={style} href='#'>
						{Status[status]} <Icon type='down' />
					</a>
				</Dropdown>;
			}
		}, {
			title: 'Semestre / Código',
			dataIndex: 'semester.SI',
			render: (text, record) => (
				`${ record.semester.SI } / ${ record.code.SI }`
			)
		}, {
			title: 'Nome',
			dataIndex: 'name.SI'
		}, {
			title: 'Dependencias',
			dataIndex: 'requirement.SI',
			render: (text) => {
				if (text && text.length) {
					return text.map(t => {
						const tip = Grade.findOne({'code.SI': t});
						if (tip && tip.name && tip.name.SI) {
							return <Tooltip key={t} title={`${ tip.name.SI } - Semestre ${ tip.semester.SI }`}>
								<Tag color='red'>{t}</Tag>
							</Tooltip>;
						}

						return <Tag key={t} color='red'>{t}</Tag>;
					});
				}
			}
		}, {
			title: 'Créditos / Carga Horária',
			dataIndex: 'credit',
			render: (text, record) => (
				`${ record.credit } / ${ record.workload }`
			)
		}];
	}

	onRow(record) {
		const style = {};

		if (record.semester.SI === 'E') {
			style.backgroundColor = '#DBEAFF';
		} else if ((record.semester.SI % 2) === 0) {
			style.backgroundColor = '#f1f1f1';
		}

		const {user} = this.props;

		const itemStatus = (user && user.grade && user.grade[record._id]) || 'pending';

		switch (itemStatus) {
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

	render() {
		return (
			<Table
				dataSource={this.props.grade}
				columns={this.columns}
				pagination={false}
				expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
				onRow={this.onRow.bind(this)}
			/>
		);
	}
}

export default withTracker(() => {
	return {
		user: Meteor.user(),
		grade: Grade.find({
			'code.SI': {
				$exists: true
			}
		}, {
			sort: {
				'semester.SI': 1,
				'code.SI': 1
			}
		}).fetch()
	};
})(App);
