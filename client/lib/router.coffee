Router.configure
	layoutTemplate: 'Layout'

Router.route '/', ->
	@render 'Grade'