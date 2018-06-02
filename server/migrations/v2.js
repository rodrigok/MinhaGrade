Migrations.add({
	version: 2,
	up() {
		const users = Meteor.users.find().fetch();

		return (() => {
			const result = [];
			for (let user of Array.from(users)) {
				var code, grade, key, value;
				const newGrade = {};

				if (user.grade != null) {
					for (key in user.grade) {
						value = user.grade[key];
						key = key.split('-');
						if (key.length !== 3) {
							newGrade[key] = value;
						} else {
							code = key.pop();
							grade = Grade.findOne({$or: [{'code.SI': code}, {'code.TSI': code}]});
							if (grade != null) {
								newGrade[grade._id] = value;
							}
						}
					}
				}


				if (user.calendar != null) {
					for (key in user.calendar) {
						value = user.calendar[key];
						const newValue = [];
						if (Match.test(value, [String])) {
							for (let item of Array.from(value)) {
								const k = item.split('-');
								if (k.length !== 4) {
									newValue.push(item);
								} else {
									code = k.pop();
									grade = Grade.findOne({$or: [{'code.SI': code}, {'code.TSI': code}]});
									if (grade != null) {
										newValue.push(grade._id);
									}
								}
							}
						}

						user.calendar[key] = newValue;
					}
				}


				result.push(Meteor.users.update(user._id, {$set: {grade: newGrade, calendar: user.calendar}}));
			}
			return result;
		})();
	}});
