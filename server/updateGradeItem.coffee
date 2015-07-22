Meteor.methods
	updateGradeItem: (gradeItemId, status) ->
		console.log 'updateGradeItem', gradeItemId, status

		if not @userId?
			return

		switch status
			when 'done', 'doing'
				update = {}
				update["grade.#{gradeItemId}"] = status
				Meteor.users.update(@userId, $set: update)

			when 'pending'
				update = {}
				update["grade.#{gradeItemId}"] = 1
				Meteor.users.update(@userId, $unset: update)