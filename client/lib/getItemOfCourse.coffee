@getItemOfCourse = (item) ->
	grade = Session.get('grade').toUpperCase()

	return {
		_id: item._id
		semester: item.semester?[grade]
		code: item.code?[grade]
		name: item.name?[grade]
		requirement: item.requirement?[grade]
		credit: item.credit
		workload: item.workload
		description: item.description
	}