Template.Grade.helpers
	grade: ->
		return Grade.find({course: 'SI'})

	canEdit: ->
		return Meteor.user()? and not Router.current().params.email?
