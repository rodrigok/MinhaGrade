Template.Grade.helpers
	grade: ->
		return Grade.find({course: 'SI'}, {sort: {_id: 1}})

	canEdit: ->
		return Meteor.user()? and not Router.current().params.email?
