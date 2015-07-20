Router.configure
	layoutTemplate: 'Layout'


Router.route '/', ->
	return @redirect '/course/si'


Router.route '/si', ->
	return @redirect '/course/si'


Router.route '/tsi', ->
	return @redirect '/course/tsi'


Router.route '/course/:course',
	name: 'course'

	waitOn: ->
		return [
			Meteor.subscribe 'Grade'
			Meteor.subscribe 'userGradeInfo'
		]

	action: ->
		course = @params.course.toLowerCase()
		if course not in ['si', 'tsi']
			return @redirect '/course/si'

		Session.set 'grade', course

		Session.set 'grade-filter-status', @params.query.status

		@render 'Grade'

	fastRender: true


Router.route '/my/:course/:email',
	name: 'my'

	waitOn: ->
		return [
			Meteor.subscribe 'Grade'
			Meteor.subscribe 'userGradeInfo', @params.email
		]

	action: ->
		course = @params.course.toLowerCase()
		if course not in ['si', 'tsi']
			return @redirect "/course/si/#{@params.email}"

		Session.set 'grade', course

		Session.set 'grade-filter-status', @params.query.status

		@render 'Grade',
			data:
				email: @params.email

	fastRender: true


Router.route '/calendar/:calendarName/:course?',
	name: 'calendar'

	waitOn: ->
		return [
			Meteor.subscribe 'Calendar', @params.calendarName
			Meteor.subscribe 'Grade'
			Meteor.subscribe 'userGradeInfo'
		]

	action: ->
		@render 'Calendar'

	fastRender: true

