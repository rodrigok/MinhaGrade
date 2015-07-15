Router.configure
	layoutTemplate: 'Layout'


Router.route '/', ->
	@wait Meteor.subscribe 'Grade'
	@wait Meteor.subscribe 'userGradeInfo'

	if not @ready()
		return @render 'Loading'

	@render 'Grade'


Router.route '/my/:email', ->
	@wait Meteor.subscribe 'Grade'
	@wait Meteor.subscribe 'userGradeInfo', @params.email

	if not @ready()
		return @render 'Loading'

	@render 'Grade',
		data:
			email: @params.email