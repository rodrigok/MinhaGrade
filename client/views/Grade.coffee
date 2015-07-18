Template.Grade.helpers
	grade: ->
		grade = Session.get('grade').toUpperCase()
		if not grade in ['SI', 'TSI']
			grade = 'SI'

		return Grade.find({course: grade}, {sort: {_id: 1}})

	canEdit: ->
		return Meteor.user()? and not Router.current().params.email?
