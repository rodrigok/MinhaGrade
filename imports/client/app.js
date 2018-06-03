import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Grade } from '../lib/collections';
import 'antd/dist/antd.css';
import {
	Menu,
	Dropdown,
	Icon,
	message,
	Tooltip,
	Tag,
	Table,
	Progress,
	Layout
} from 'antd';

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

	state = {}

	static getDerivedStateFromProps(props) {
		const {user} = props;

		const columns = [{
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
						const style = {
							color: '#f50'
						};
						const tip = Grade.findOne({'code.SI': t});

						switch (tip && user && user.grade && user.grade[tip._id]) {
							case 'done':
								style.color = '#d3d3d3';
								break;
							case 'doing':
								style.color = '#ffa500';
								break;
						}

						if (tip && tip.name && tip.name.SI) {
							return <Tooltip key={t} title={`${ tip.name.SI } - Semestre ${ tip.semester.SI }`}>
								<Tag color={style.color}>{t}</Tag>
							</Tooltip>;
						}

						return <Tag key={t} color={style.color}>{t}</Tag>;
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

		if (user !== null) {
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
					const status = (user.grade && user.grade[record._id]) || 'pending';
					return status.includes(value);
				},
				render: (text, record) => {
					const status = (user.grade && user.grade[record._id]) || 'pending';

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
			});
		}

		return {
			columns
		};
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

	percentageDone() {
		const {user} = this.props;
		if (user == null) {
			return;
		}

		const query = {
			'code.SI': {$exists: true}
		};

		const grade = Grade.find(query).fetch();

		let total = 0;
		let done = 0;
		let doing = 0;
		let electiveMax = 1;

		for (const item of grade) {
			if ((item.semester.SI !== 'E') || (electiveMax-- > 0)) {
				total++;
				if (user && user.grade && user.grade[item._id] === 'done') {
					done++;
				} else if (user && user.grade && user.grade[item._id] === 'doing') {
					doing++;
				}
			}
		}

		const percentageDone = Math.round((100 / total) * done);
		const percentageDoing = Math.round((100 / total) * doing);

		return <Tooltip title={`${ done } concluída(s) + ${ doing } cursando de ${ total }`}>
			<Progress percent={percentageDone+percentageDoing} successPercent={percentageDone} />;
		</Tooltip>;
	}

	render() {
		return (
			<div>
				<Layout>
					<Layout.Header>
						<div className='logo' />
						<Menu
							theme='dark'
							mode='horizontal'
							defaultSelectedKeys={['2']}
							style={{ lineHeight: '64px' }}
						>
							<Menu.Item key='1'>nav 1</Menu.Item>
							<Menu.Item key='2'>nav 2</Menu.Item>
							<Menu.Item key='3'>nav 3</Menu.Item>
						</Menu>
					</Layout.Header>
					<Layout.Content>
						{this.percentageDone()}

						<Table
							dataSource={this.props.grade}
							columns={this.state.columns}
							pagination={false}
							expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
							onRow={this.onRow.bind(this)}
						/>
					</Layout.Content>
				</Layout>
			</div>
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
