Template.Calendar.helpers
	calendar: ->
		calendar = {}

		calendarRecord = Calendar.findOne()
		calendarGrade = calendarRecord.grade

		for calendarGradeItem in calendarGrade
			gradeItem = Grade.findOne(calendarGradeItem._id)

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