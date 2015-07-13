Meteor.methods
	updateGradeItem: (gradeItemId, status) ->
		if not this.userId?
			return

		switch status
			when 'done', 'doing'
				update = {}
				update["grade.#{gradeItemId}"] = status
				Meteor.users.update(this.userId, $set: update)

			when 'pending'
				update = {}
				update["grade.#{gradeItemId}"] = 1
				Meteor.users.update(this.userId, $unset: update)