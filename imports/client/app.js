import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Grade } from '../lib/collections';
import { Table } from 'antd';
import { Tag } from 'antd';
import { Tooltip } from 'antd';
import 'antd/dist/antd.css';

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


// App component - represents the whole app
class App extends Component {
	static propTypes = {
		grade: PropTypes.any
	}

	onRow(record) {
		let color;

		if (record.semester.SI === 'E') {
			color = '#DBEAFF';
		} else if ((record.semester.SI % 2) === 0) {
			color = '#f1f1f1';
		}

		return {
			style: {
				backgroundColor: color
			}
		};
	}

	render() {
		return (
			<Table
				dataSource={this.props.grade}
				columns={columns}
				pagination={false}
				expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
				onRow={this.onRow}
			/>
		);
	}
}

export default withTracker(() => {
	return {
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
