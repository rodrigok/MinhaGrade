Template.Calendar.helpers
	calendar: ->
		grade = Session.get('grade') or 'SI'
		grade = grade.toUpperCase()

		calendar = {}

		calendarRecord = Calendar.findOne()
		calendarGrade = calendarRecord.grade

		for calendarGradeItem in calendarGrade
			query =
				_id: calendarGradeItem._id

			query['code.' + grade] = $exists: true
			gradeItem = getItemOfCourse Grade.findOne(query)

			if not gradeItem?
				continue

			shift =  's' + calendarGradeItem.shift

			calendar[shift] ?= {}

			calendar[shift][gradeItem.semester] ?= {}

			day = 'd' + calendarGradeItem.day

			calendar[shift][gradeItem.semester][day] ?= []

			calendar[shift][gradeItem.semester][day].push
				gradeItem: gradeItem
				calendarItem: calendarGradeItem
				calendar: calendarRecord

		for key, calendarItem of calendar
			calendar[key] = ({semester: key, value: value} for key, value of calendarItem)

		return calendar