Template.Layout.helpers
	isAdmin: ->
		return Meteor.user()?.admin is true

	calendars: ->
		return Calendar.find()


Template.Layout.onRendered ->
	$('.menu .ui.dropdown').dropdown()
