Template.Grade.onCreated ->
	@subscribe 'Grade'
	@subscribe 'userGradeInfo'

Template.Grade.helpers
	grade: ->
		return Grade.find({course: 'SI'})
