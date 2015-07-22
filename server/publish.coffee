Meteor.publish 'Grade', ->
	return Grade.find()

Meteor.publish 'Calendar', (name) ->
	query = {}
	if name?
		query._id = name

	return Calendar.find(query)

Meteor.publish 'userGradeInfo', (email) ->
	query = @userId
	if email?
		query =
			'emails.address': email

	return Meteor.users.find(query, {fields: {grade: 1, emails: 1, calendar: 1}, sort: {_id: 1}})