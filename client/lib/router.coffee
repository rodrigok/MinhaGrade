Router.configure
	layoutTemplate: 'Layout'


Router.route '/', ->
	@redirect '/si'


Router.route '/si', ->
	@wait Meteor.subscribe 'Grade'
	@wait Meteor.subscribe 'userGradeInfo'

	if not @ready()
		return @render 'Loading'

	Session.set 'grade', 'si'
	@render 'Grade'


Router.route '/tsi', ->
	@wait Meteor.subscribe 'Grade'
	@wait Meteor.subscribe 'userGradeInfo'

	if not @ready()
		return @render 'Loading'

	Session.set 'grade', 'tsi'
	@render 'Grade'


Router.route '/my/:email', ->
	@wait Meteor.subscribe 'Grade'
	@wait Meteor.subscribe 'userGradeInfo', @params.email

	if not @ready()
		return @render 'Loading'

	@render 'Grade',
		data:
			email: @params.email