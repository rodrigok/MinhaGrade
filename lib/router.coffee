Router.configure
	layoutTemplate: 'Layout'


Router.route '/', ->
	@redirect '/si'


Router.route '/si',
	waitOn: ->
		return [
			Meteor.subscribe 'Grade'
			Meteor.subscribe 'userGradeInfo'
		]

	action: ->
		Session.set 'grade', 'si'
		@render 'Grade'

	fastRender: true


Router.route '/tsi',
	waitOn: ->
		return [
			Meteor.subscribe 'Grade'
			Meteor.subscribe 'userGradeInfo'
		]

	action: ->
		Session.set 'grade', 'tsi'
		@render 'Grade'

	fastRender: true


Router.route '/my/:email', ->
	@wait Meteor.subscribe 'Grade'
	@wait Meteor.subscribe 'userGradeInfo', @params.email

	if not @ready()
		return @render 'Loading'

	@render 'Grade',
		data:
			email: @params.email