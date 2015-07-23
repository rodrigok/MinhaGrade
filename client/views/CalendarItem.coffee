Template.CalendarItem.helpers
	style: ->
		user = Meteor.user()

		styles = []

		itemStatus = user?.grade?[@gradeItem._id]
		itemStatus ?= 'pending'

		switch itemStatus
			when 'done'
				styles.push 'color: lightgray'
			when 'doing'
				styles.push 'color: orange'

		return styles.join '; '

	canMarkInterrest: ->
		user = Meteor.user()

		if not user?
			return false

		return user.grade?[@gradeItem._id] isnt 'done'

	intereseted: ->
		user = Meteor.user()
		key = "#{@calendarItem.shift}#{@calendarItem.day}-#{@gradeItem._id}"
		return user?.calendar?[@calendar._id]?.indexOf(key) > -1

	getOverlayColor: ->
		r = Math.round(Math.random() * 4) * 10
		l = 100 - r
		h = 50 - r

		return "hsl(#{h}, 100%, #{l}%)"


Template.CalendarItem.events
	'click button.remove-interest': (e) ->
		Meteor.call 'updateCalendarItemInterest', @calendar._id, @gradeItem._id, @calendarItem.shift, @calendarItem.day, false

	'click button.mark-interest': (e) ->
		Meteor.call 'updateCalendarItemInterest', @calendar._id, @gradeItem._id, @calendarItem.shift, @calendarItem.day, true