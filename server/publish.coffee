Meteor.publish 'Grade', ->
	return Grade.find()

Meteor.publish 'userGradeInfo', ->
	return Meteor.users.find(@userId, {fields: {grade: 1}})