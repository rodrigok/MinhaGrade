Template.CalendarEdit.helpers
	calendar: ->
		return Calendar.findOne({_id: Router.current().params.calendarName})

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

Template.CalendarEdit.onRendered ->
	$('.dropdown').dropdown()