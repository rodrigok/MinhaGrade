Meteor.publish 'Grade', ->
	return Grade.find()

Meteor.publish 'Calendar', (name) ->
	return Calendar.find({_id: name})

Meteor.publish 'userGradeInfo', (email) ->
	query = @userId
	if email?
		query =
			'emails.address': email

	return Meteor.users.find(query, {fields: {grade: 1, emails: 1, calendar: 1}, sort: {_id: 1}})