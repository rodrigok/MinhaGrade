Template.CalendarEdit.helpers
	calendar: ->
		calendar = Calendar.findOne({_id: Router.current().params.calendarName})

		calendar.grade ?= []

		calendar.grade = _.sortBy calendar.grade, 'day'
		calendar.grade = _.sortBy calendar.grade, 'shift'

		return calendar

	grade: ->
		return Grade.find()

	getGradeNames: (_id) ->
		grade = Grade.findOne _id
		names = []
		for key, name of grade.name
			names.push name

		return names

	getNames: (item) ->
		names = []
		for key, value of item.code
			names.push item.name[key]

		return names.join(' | ')

	shifts: ->
		days = [
			name: 'Segunda'
			day: '2'
		,
			name: 'Terça'
			day: '3'
		,
			name: 'Quarta'
			day: '4'
		,
			name: 'Quinta'
			day: '5'
		,
			name: 'Sexta'
			day: '6'
		,
			name: 'Sábado'
			day: '7'
		]

		return [
			name: 'Noite'
			shift: '3'
			days: days
		,
			name: 'Vespertino'
			shift: '5'
			days: days
		,
			name: 'Tarde'
			shift: '2'
			days: days
		,
			name: 'Manhã'
			shift: '1'
			days: days
		]

	getShift: (shift) ->
		shift = String(shift)
		shifts =
			'0': 'EAD'
			'1': 'Manhã'
			'2': 'Tarde'
			'3': 'Noite'
			'5': 'Vespertino'

		return shifts[shift]

	getDay: (day) ->
		day = String(day)
		days =
			'0': 'EAD'
			'2': 'Segunda'
			'3': 'Terça'
			'4': 'Quarta'
			'5': 'Quinta'
			'6': 'Sexta'
			'7': 'Sábado'

		return days[day]


Template.CalendarEdit.onRendered ->
	$('.dropdown').dropdown()

Template.CalendarEdit.events
	'click .add-calendar-item': ->
		shiftEl = $('.shift .item.selected')
		subjectEl = $('.subject .item.selected')

		if shiftEl.data('day')? and subjectEl.data('id')?
			day = shiftEl.data('day')
			shift = shiftEl.data('shift')
			gradeItemId = subjectEl.data('id')

			Meteor.call 'addItemToCalendar', Router.current().params.calendarName, gradeItemId, shift, day

	'click .remove-item': ->
		Meteor.call 'removeItemFromCalendar', Router.current().params.calendarName, @_id, @shift, @day

	'blur .teacher': (e) ->
		input = e.target
		value = input.value.trim()
		if value isnt @teacher
			Meteor.call 'setTeacherInCalendarItem', Router.current().params.calendarName, @_id, @shift, @day, value
