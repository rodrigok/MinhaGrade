import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import {
	Alert,
	Card,
	Icon,
	Tooltip,
	Tag,
	Spin,
	Switch,
	Form,
} from 'antd';

const Status = {
	pending: 'Pendente',
	doing: 'Cursando',
	done: 'Concluído',
};

class CalendarItemComponent extends Component {
	static propTypes = {
		gradeItem: PropTypes.any,
		calendarItem: PropTypes.any,
		calendar: PropTypes.object,
		updateInterest: PropTypes.func,
	}

	state = {}

	updateInterest = (interested) => {
		const { gradeItem, calendarItem, calendar } = this.props;

		this.props.updateInterest(gradeItem, calendarItem, calendar, interested);
	}

	removeInterest() {
		this.updateInterest(false);
	}

	addInterest() {
		this.updateInterest(true);
	}

	render() {
		const { gradeItem, calendarItem } = this.props;

		const itemStatus = calendarItem.userStatus || 'pending';

		const actions = [];
		let description;

		if (itemStatus === 'pending') {
			if (calendarItem.userInterested) {
				actions.push(
					<Tooltip placement='bottom' title='Remover interesse'>
						<Icon type='heart' theme='filled' onClick={this.removeInterest.bind(this)} />
					</Tooltip>
				);
			} else {
				actions.push(
					<Tooltip placement='bottom' title='Marcar interesse'>
						<Icon type='heart' onClick={this.addInterest.bind(this)} />
					</Tooltip>
				);
			}
			// actions.push(<Icon type='ellipsis' />);
		}

		description = `Interessados: ${ calendarItem.interested }`;

		if (calendarItem.teacher && calendarItem.teacher.name) {
			description = <React.Fragment>
				<div>{description}</div>
				<div>Professor: {calendarItem.teacher.name}</div>
			</React.Fragment>;
		}

		const requirements = gradeItem.requirement.filter((r) => r.userStatus !== 'done').map((requirement) => {
			const style = {
				color: '#f50',
			};

			switch (requirement.userStatus) {
				case 'done':
					style.color = '#d3d3d3';
					break;
				case 'doing':
					style.color = '#ffa500';
					break;
			}

			return <div key={requirement._id}>
				<Tooltip key={requirement.code} title={Status[requirement.userStatus]}>
					<Tag color={style.color}>{requirement.name}</Tag>
				</Tooltip>
			</div>;
		});

		const friends = calendarItem.friendsInterested.map((friend) => <Tooltip key={friend.id} title={friend.name} placement='bottom' arrowPointAtCenter={false} mouseEnterDelay={.1}>
			<div key={friend.id} style={{ backgroundImage: `url(${ friend.pictureUrl })` }} className='friends-picture'></div>
		</Tooltip>);

		description = <React.Fragment>
			{ calendarItem.room &&
				<div>Sala: {calendarItem.room}</div>
			}
			<div>
				Semestre: {gradeItem.semester}
			</div>
			{description}
			{requirements}
			<div className='friends-picture-list'>
				{friends}
			</div>
		</React.Fragment>;

		return (
			<Card
				className={`card-${ itemStatus }`}
				actions={actions}
			>
				<Card.Meta
					title={gradeItem.name}
					description={description}
				/>
			</Card>
		);
	}
}

class CalendarComponent extends Component {
	static propTypes = {
		data: PropTypes.object,
		updateCalendarItemInterest: PropTypes.func,
	}

	state = {
		done: false,
		blocked: true,
	}

	shifts = [{
		shift: '1',
		name: 'Manhã',
	}, {
		shift: '2',
		name: 'Tarde',
	}, {
		shift: '3',
		name: 'Noite',
	}, {
		shift: '5',
		name: 'Vespertino',
	}];

	baseFilter = (item) => {
		if (!item.grade.code) {
			return false;
		}

		if (this.state.done === false && item.userStatus !== 'pending') {
			return false;
		}

		if (this.state.blocked === false) {
			return !item.grade.requirement.find((r) => r.userStatus === 'pending');
		}

		return true;
	}

	updateInterest = (gradeItem, calendarItem, calendar, interested) => {
		this.props.updateCalendarItemInterest({
			variables: {
				calendarId: calendar._id,
				gradeItemId: gradeItem._id,
				shift: calendarItem.shift,
				day: calendarItem.day,
				interested,
			},
			update: (store) => {
				const fragment = gql`
					fragment calendarFragment on calendar {
						grade {
							_id
							userInterested
						}
					}
				`;

				const data = store.readFragment({
					id: calendar._id,
					fragment,
				});

				if (data) {
					const item = data.grade.find((i) => i._id === `${ gradeItem._id }:${ calendarItem.shift }:${ calendarItem.day }`);
					if (item) {
						item.userInterested = interested;
						store.writeFragment({
							id: calendar._id,
							fragment,
							data,
						});
					}
				}
			},
		}).then(() => {
			this.props.data.refetch();
		});
	}

	renderCalendarItem(shift, day) {
		const { data: { calendar } } = this.props;

		const grade = calendar.grade.filter((d) => d.shift === shift && d.day === day).filter(this.baseFilter);

		return grade.map((item) => (
			<CalendarItemComponent
				key={item._id}
				gradeItem={item.grade}
				calendarItem={item}
				calendar={calendar}
				updateInterest={this.updateInterest}
			/>
		)).filter((i) => i);
	}

	renderShifts() {
		const { data: { calendar } } = this.props;

		const shifts = this.shifts.filter((s) => calendar.grade.filter((d) => d.shift === s.shift).filter(this.baseFilter).length);

		return shifts.map((shit) => (
			<React.Fragment key={shit.shift}>
				<tr className='shift-table-title-line'>
					<td colSpan='7'>
						<strong>Turno: {shit.name}</strong>
					</td>
				</tr>
				<tr className='shift-table-line'>
					<td>{this.renderCalendarItem.bind(this)(shit.shift, '2')}</td>
					<td>{this.renderCalendarItem.bind(this)(shit.shift, '3')}</td>
					<td>{this.renderCalendarItem.bind(this)(shit.shift, '4')}</td>
					<td>{this.renderCalendarItem.bind(this)(shit.shift, '5')}</td>
					<td>{this.renderCalendarItem.bind(this)(shit.shift, '6')}</td>
					<td>{this.renderCalendarItem.bind(this)(shit.shift, '7')}</td>
				</tr>
			</React.Fragment>
		));
	}

	renderEAD() {
		const { data: { calendar } } = this.props;

		const hasEAD = calendar.grade.filter((d) => d.shift === '0').filter(this.baseFilter).length > 0;

		if (!hasEAD) {
			return;
		}

		return (
			<div className='ant-table ant-table-large ant-table-bordered ant-table-scroll-position-left'>
				<div className='ant-table-body'>
					<table>
						<thead className='ant-table-thead'>
							<tr>
								<th>EAD</th>
							</tr>
						</thead>
						<tbody className='ant-table-tbody'>
							<tr className='shift-table-line'>
								<td>
									{this.renderCalendarItem('0', '0')}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	render() {
		const { data: { loading, error, calendar } } = this.props;

		if (loading) {
			return <Spin size='large' />;
		}

		if (error) {
			console.log(error);
			return <p>Error :(</p>;
		}

		if (!calendar) {
			return <Alert
				message='Erro'
				description='Nenhum calendário está ativo'
				type='error'
				showIcon
			/>;
		}

		return (
			<React.Fragment>
				<div>
					<div className='components-table-demo-control-bar'>
						<Form layout='inline'>
							<Form.Item label='Concluídas ou Cursando'>
								<Switch checked={this.state.done} onChange={(value) => this.setState({ done: value })} />
							</Form.Item>
							<Form.Item label='Bloqueadas'>
								<Switch checked={this.state.blocked} onChange={(value) => this.setState({ blocked: value })} />
							</Form.Item>
						</Form>
					</div>
				</div>
				{this.renderEAD()}

				<div className='ant-table ant-table-large ant-table-bordered ant-table-scroll-position-left'>
					<div className='ant-table-body'>
						<table>
							<thead className='ant-table-thead'>
								<tr>
									<th width='16.66%'>Segunda</th>
									<th width='16.66%'>Terça</th>
									<th width='16.66%'>Quarta</th>
									<th width='16.66%'>Quinta</th>
									<th width='16.66%'>Sexta</th>
									<th width='16.66%'>Sábado</th>
								</tr>
							</thead>
							<tbody className='ant-table-tbody'>
								{this.renderShifts()}
							</tbody>
						</table>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(gql`
		query {
			calendar {
				_id
				grade {
					_id
					day
					shift
					interested
					room
					teacher {
						name
					}
					userStatus
					userInterested
					friendsInterested {
						id
						name
						pictureUrl
					}
					grade {
						_id
						code
						name
						semester
						requirement {
							_id
							code
							name
							userStatus
						}
					}
				}
			}
		}
	`),
	graphql(gql`
		mutation updateCalendarItemInterest(
			$calendarId: String!
			$gradeItemId: String!
			$shift: String!
			$day: String!
			$interested: Boolean!
		) {
			updateCalendarItemInterest(
				calendarId: $calendarId
				gradeItemId: $gradeItemId
				shift: $shift
				day: $day
				interested: $interested
			)
		}
	`, { name: 'updateCalendarItemInterest' })
)(CalendarComponent);
