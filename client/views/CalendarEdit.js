import _ from 'underscore';
import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import {
	Table,
	Popconfirm,
	Button,
	Select,
	Input,
} from 'antd';

const days = {
	0: 'EAD',
	2: 'Segunda',
	3: 'Terça',
	4: 'Quarta',
	5: 'Quinta',
	6: 'Sexta',
	7: 'Sábado',
};

const shifts = {
	0: 'EAD',
	1: 'Manhã',
	2: 'Tarde',
	3: 'Noite',
	5: 'Vespertino',
};

class CalendarEdit extends Component {
	static propTypes = {
		data: PropTypes.object,
		match: PropTypes.object,
		setTeacherInCalendarItem: PropTypes.func,
		removeItemFromCalendar: PropTypes.func,
		addItemToCalendar: PropTypes.func,
		setRoomInCalendarItem: PropTypes.func,
	}

	state = {}

	constructor() {
		super();

		const columns = [{
			title: 'Ações',
			key: 'actions',
			width: 80,
			render: (text, record) => (
				<span>
					<Popconfirm title='Deseja deletar?' onConfirm={() => this.onDelete(record)}>
						<a href='javascript:;'>Deletar</a>
					</Popconfirm>
				</span>
			),
		}, {
			title: 'Turno',
			dataIndex: 'shift',
			width: 80,
			render(text) {
				return shifts[text];
			},
		}, {
			title: 'Dia',
			dataIndex: 'day',
			width: 100,
			render(text) {
				return days[text];
			},
		}, {
			title: 'Nome',
			dataIndex: 'grade.allNames',
			render(text) {
				return _.unique(Object.values(text)).join(' | ');
			},
		}, {
			title: 'Alunos',
			dataIndex: 'interested',
			width: 80,
		}, {
			title: 'Professor',
			dataIndex: 'teacher._id',
			width: 200,
			render: (text, record) => {
				const { data: { teachers } } = this.props;

				return (
					<Select
						showSearch
						filterOption
						optionFilterProp='name'
						defaultValue={text}
						placeholder='Professores'
						style={{ width: 200 }}
						onChange={(value) => this.setTeacher(value, record)}
					>
						<Select.Option key='undefined' value=''>Não definido</Select.Option>
						{teachers.map((teacher) => (
							<Select.Option key={teacher._id} value={teacher._id} name={teacher.name}>{teacher.name}</Select.Option>
						))}
					</Select>
				);
			},
		}, {
			title: 'Sala',
			dataIndex: 'room',
			width: 100,
			render: (text, record) => (
				<Input
					defaultValue={text}
					placeholder='Sala'
					style={{ width: 100 }}
					onBlur={(e) => this.setRoom(e.target.value, record)}
				></Input>
			),
		}];

		this.state = {
			columns,
		};
	}

	setTeacher(teacher, record) {
		teacher = teacher.trim();
		if (teacher !== record.teacher) {
			this.props.setTeacherInCalendarItem({
				variables: {
					calendarId: this.props.match.params.calendarName,
					gradeItemId: record.grade._id,
					shift: record.shift,
					day: record.day,
					teacherId: teacher,
				},
			}).then(() => {
				this.props.data.refetch();
			}).catch((e) => console.error(e));
		}
	}

	setRoom(room, record) {
		room = room.trim();
		if (room !== record.room) {
			this.props.setRoomInCalendarItem({
				variables: {
					calendarId: this.props.match.params.calendarName,
					gradeItemId: record.grade._id,
					shift: record.shift,
					day: record.day,
					room,
				},
			}).then(() => {
				this.props.data.refetch();
			}).catch((e) => console.error(e));
		}
	}

	onDelete(record) {
		this.props.removeItemFromCalendar({
			variables: {
				calendarId: this.props.match.params.calendarName,
				gradeItemId: record.grade._id,
				shift: record.shift,
				day: record.day,
			},
		}).then(() => {
			this.props.data.refetch();
		}).catch((e) => console.error(e));
	}

	handleAdd() {
		if (this.state.selectedItem && this.state.selectedShift && this.state.selectedDay) {
			this.props.addItemToCalendar({
				variables: {
					calendarId: this.props.match.params.calendarName,
					gradeItemId: this.state.selectedItem,
					shift: this.state.selectedShift,
					day: this.state.selectedDay,
				},
			}).then(() => {
				this.props.data.refetch();
			}).catch((e) => console.error(e));
		}
	}

	shifts() {
		return Object.entries(shifts).map(([shift, shiftName]) => {
			if (shift === '0') {
				return;
			}

			return Object.entries(days).map(([day, dayName]) => {
				if (day === '0') {
					return;
				}

				return <Select.Option key={`${ shiftName } - ${ day.name }`} value={`${ shift }-${ day }`} name={`${ shiftName } - ${ dayName }`}>{`${ shiftName } - ${ dayName }`}</Select.Option>;
			});
		});
	}

	grade() {
		const { data: { grades = [] } } = this.props;

		return grades.map((item) => <Select.Option key={item._id} value={item._id} name={item.name}>{item.name}</Select.Option>);
	}

	render() {
		const { data: { calendar: { grade = [] } = {}, loading } } = this.props;

		return (
			<div>
				<Select
					showSearch
					autoFocus
					filterOption
					optionFilterProp='name'
					placeholder='Escolha dia e turno'
					style={{ width: 200 }}
					onChange={(value) => {
						const [selectedShift, selectedDay] = value.split('-');
						this.setState({ selectedShift, selectedDay });
					}}
				>
					<Select.Option key='EAD' value='0-0'>EAD</Select.Option>
					{this.shifts()}
				</Select>

				<Select
					showSearch
					filterOption
					optionFilterProp='name'
					placeholder='Escolha a matéria'
					style={{ width: 200 }}
					dropdownMatchSelectWidth={false}
					onChange={(value) => this.setState({ selectedItem: value })}
				>
					{this.grade()}
				</Select>

				<Button onClick={this.handleAdd.bind(this)} type='primary' style={{ marginBottom: 16 }}>
					Adicionar
				</Button>

				<Table
					bordered
					dataSource={grade}
					loading={loading}
					columns={this.state.columns}
					rowKey={(r) => r._id + r.shift + r.day}
					pagination={false}
				/>
			</div>
		);
	}
}


export default compose(
	graphql(gql`
		query ($calendarName: String) {
			grades {
				_id
				name
			}
			teachers {
				_id
				name
			}
			calendar (_id: $calendarName) {
				_id
				grade {
					_id
					day
					shift
					interested
					room
					teacher {
						_id,
						name
					}
					grade {
						_id
						code
						allNames
					}
				}
			}
		}
	`, {
		options: ({ match }) => ({
			variables: {
				calendarName: match.params.calendarName,
			},
		}),
	}),
	graphql(gql`
		mutation setTeacherInCalendarItem(
			$calendarId: String!
			$gradeItemId: String!
			$shift: String!
			$day: String!
			$teacherId: String!
		) {
			setTeacherInCalendarItem(
				calendarId: $calendarId
				gradeItemId: $gradeItemId
				shift: $shift
				day: $day
				teacherId: $teacherId
			)
		}
	`, { name: 'setTeacherInCalendarItem' }),
	graphql(gql`
		mutation setRoomInCalendarItem(
			$calendarId: String!
			$gradeItemId: String!
			$shift: String!
			$day: String!
			$room: String!
		) {
			setRoomInCalendarItem(
				calendarId: $calendarId
				gradeItemId: $gradeItemId
				shift: $shift
				day: $day
				room: $room
			)
		}
	`, { name: 'setRoomInCalendarItem' }),
	graphql(gql`
		mutation removeItemFromCalendar(
			$calendarId: String!
			$gradeItemId: String!
			$shift: String!
			$day: String!
		) {
			removeItemFromCalendar(
				calendarId: $calendarId
				gradeItemId: $gradeItemId
				shift: $shift
				day: $day
			)
		}
	`, { name: 'removeItemFromCalendar' }),
	graphql(gql`
		mutation addItemToCalendar(
			$calendarId: String!
			$gradeItemId: String!
			$shift: String!
			$day: String!
		) {
			addItemToCalendar(
				calendarId: $calendarId
				gradeItemId: $gradeItemId
				shift: $shift
				day: $day
			)
		}
	`, { name: 'addItemToCalendar' })
)(CalendarEdit);
