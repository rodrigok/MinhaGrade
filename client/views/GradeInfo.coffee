Template.GradeInfo.onRendered ->
	Meteor.autorun ->
		$('.ui.modal.grade-info').modal
			onHidden: ->
				Session.set 'modalInfoShow', false

		if Session.get('modalInfoShow') is true
			$('.ui.modal.grade-info').modal('show')
		else
			$('.ui.modal.grade-info').modal('hide')

Template.GradeInfo.helpers
	description: ->
		Session.get 'modalInfoDescription'

	title: ->
		Session.get 'modalInfoTitle'