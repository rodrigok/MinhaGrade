Migrations.add
	version: 2,
	up: ->
		users = Meteor.users.find().fetch()

		for user in users
			newGrade = {}

			if user.grade?
				for key, value of user.grade
					key = key.split('-')
					if key.length isnt 3
						newGrade[key] = value
					else
						code = key.pop()
						grade = Grade.findOne({$or: [{'code.SI': code}, {'code.TSI': code}]})
						if grade?
							newGrade[grade._id] = value


			if user.calendar?
				for key, value of user.calendar
					newValue = []
					if Match.test value, [String]
						for item in value
							k = item.split('-')
							if k.length isnt 4
								newValue.push item
							else
								code = k.pop()
								grade = Grade.findOne({$or: [{'code.SI': code}, {'code.TSI': code}]})
								if grade?
									newValue.push grade._id

					user.calendar[key] = newValue


				Meteor.users.update user._id, {$set: {grade: newGrade, calendar: user.calendar}}
