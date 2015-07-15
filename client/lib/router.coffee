Router.configure
	layoutTemplate: 'Layout'

Router.route '/', ->
	@render 'Grade'

Router.route '/my/:email', ->
	@render 'Grade',
		data:
			email: @params.email