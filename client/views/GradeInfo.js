Template.GradeInfo.onRendered(() =>
	Meteor.autorun(function() {
		$('.ui.modal.grade-info').modal({
			onHidden() {
				return Session.set('modalInfoShow', false);
			}
		});

		if (Session.get('modalInfoShow') === true) {
			return $('.ui.modal.grade-info').modal('show');
		} else {
			return $('.ui.modal.grade-info').modal('hide');
		}
	})
);

Template.GradeInfo.helpers({
	description() {
		return Session.get('modalInfoDescription');
	},

	title() {
		return Session.get('modalInfoTitle');
	}
});