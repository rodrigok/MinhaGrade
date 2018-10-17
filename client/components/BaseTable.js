import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Table,
} from 'antd';

export class BaseTableComponent extends Component {
	static propTypes = {
		data: PropTypes.object,
	}

	state = {}

	static getDerivedStateFromProps(props, state) {
		return {
			...state,
			records: props.data.records,
		};
	}

	render() {
		const { records } = this.state;
		const { data: { loading } } = this.props;

		return (
			<Table
				bordered
				loading={loading}
				dataSource={records}
				columns={this.state.columns}
				rowKey='_id'
				pagination={false}
			/>
		);
	}
}
