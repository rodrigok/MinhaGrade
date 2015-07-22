Template.Calendars.helpers
	calendars: ->
		return Calendar.find()

Template.Calendars.events
	'click .add-calendar': ->
		value = prompt('Informe um nome', (new Date).getFullYear())

		if value? and value.trim() isnt ''
			Meteor.call 'createCalendar', value

	'click .remove-calendar': ->
		Meteor.call 'removeCalendar', @_id