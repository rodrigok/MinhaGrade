import _ from 'underscore';
import {Router} from 'meteor/iron:router';
import {Calendar, Grade} from '../../lib/collections';
import './CalendarEdit.html';



import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {
	Table,
	Popconfirm,
	Button,
	Input,
	Select
} from 'antd';


import { render } from 'react-dom';

const days = {
	'0': 'EAD',
	'2': 'Segunda',
	'3': 'Terça',
	'4': 'Quarta',
	'5': 'Quinta',
	'6': 'Sexta',
	'7': 'Sábado'
};

const shifts = {
	'0': 'EAD',
	'1': 'Manhã',
	'2': 'Tarde',
	'3': 'Noite',
	'5': 'Vespertino'
};

class CalendarEdit extends Component {
	static propTypes = {
		data: PropTypes.any
	}

	state = {}

	constructor() {
		super();

		const columns = [{
			title: 'Ações',
			key: 'actions',
			width: 80,
			render: (text, record) => {
				return (
					<span>
						<Popconfirm title='Deseja deletar?' onConfirm={() => this.onDelete(record)}>
							<a href='javascript:;'>Deletar</a>
						</Popconfirm>
					</span>
				);
			}
		}, {
			title: 'Turno',
			dataIndex: 'shift',
			width: 80,
			render(text) {
				return shifts[text];
			}
		}, {
			title: 'Dia',
			dataIndex: 'day',
			width: 100,
			render(text) {
				return days[text];
			}
		}, {
			title: 'Nome',
			dataIndex: '_id',
			render(text) {
				return _.unique(Object.values(Grade.findOne({_id: text}).name)).join(' | ');
			}
		}, {
			title: 'Alunos',
			dataIndex: 'interested',
			width: 80
		}, {
			title: 'Professor',
			dataIndex: 'teacher',
			width: 200,
			render: (text, record) => {
				return <Input placeholder='Professor' defaultValue={text} onBlur={(value) => this.setTeacher(value.target.value, record)} />;
			}
		}];

		this.state = {
			columns
		};
	}

	setTeacher(teacher, record) {
		teacher = teacher.trim();
		if (teacher !== record.teacher) {
			return Meteor.call('setTeacherInCalendarItem', Router.current().params.calendarName, record._id, record.shift, record.day, teacher);
		}
	}

	onDelete(record) {
		return Meteor.call('removeItemFromCalendar', Router.current().params.calendarName, record._id, record.shift, record.day);
	}

	handleAdd() {
		if (this.state.selectedItem && this.state.selectedShift && this.state.selectedDay) {
			return Meteor.call('addItemToCalendar', Router.current().params.calendarName, this.state.selectedItem, this.state.selectedShift, this.state.selectedDay);
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

				return <Select.Option key={`${ shiftName } - ${ day.name }`} value={`${ shift }-${ day }`}>{`${ shiftName } - ${ dayName }`}</Select.Option>;
			});
		});
	}

	grade() {
		return Grade.find().fetch().map(item => {
			const name = _.unique(Object.values(item.name)).join(' | ');
			return <Select.Option key={item._id} value={item._id}>{name}</Select.Option>;
		});
	}

	render() {
		return (
			<div>
				<Select
					showSearch
					autoFocus
					placeholder='Escolha dia e turno'
					style={{ width: 200 }}
					onChange={(value) => {
						const [selectedShift, selectedDay] = value.split('-');
						this.setState({selectedShift, selectedDay});
					}}
				>
					<Select.Option key='EAD' value='0-0'>EAD</Select.Option>
					{this.shifts()}
				</Select>

				<Select
					showSearch
					placeholder='Escolha a matéria'
					style={{ width: 200 }}
					dropdownMatchSelectWidth={false}
					onChange={(value) => this.setState({selectedItem: value})}
				>
					{this.grade()}
				</Select>

				<Button onClick={this.handleAdd.bind(this)} type='primary' style={{ marginBottom: 16 }}>
					Adicionar
				</Button>

				<Table
					dataSource={this.props.data}
					columns={this.state.columns}
					pagination={false}
				/>
			</div>
		);
	}
}

const CalendarEditsWithTracking = withTracker(() => {
	const calendar = Calendar.findOne({_id: Router.current().params.calendarName});

	return {
		user: Meteor.user(),
		data: (calendar && calendar.grade) || []
	};
})(CalendarEdit);

Template.CalendarEdit.onRendered(() => {
	render(<CalendarEditsWithTracking />, document.getElementById('render-calendarEdit'));
});
