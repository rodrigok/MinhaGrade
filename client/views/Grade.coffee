Template.Grade.onCreated ->
	@subscribe 'Grade'
	@subscribe 'userGradeInfo', @data.email

Template.Grade.helpers
	grade: ->
		return Grade.find({course: 'SI'})
