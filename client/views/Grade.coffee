Template.Grade.helpers
	grade: ->
		return Grade.find({course: 'SI'})
