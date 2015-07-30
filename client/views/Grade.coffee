Template.Grade.helpers
	grade: ->
		grade = Session.get('grade').toUpperCase()
		if not grade in ['SI', 'TSI']
			grade = 'SI'

		query = {}
		query['code.' + grade] = $exists: true

		sort = {}
		sort['semester.' + grade] = 1
		sort['code.' + grade] = 1

		return Grade.find(query, {sort: sort})

	canEdit: ->
		return Meteor.user()? and not Router.current().params.email?

	isSelected: (status) ->
		currentStatus = Session.get('grade-filter-status') or 'all'
		if status is currentStatus
			return {
				selected: true
			}

	course: ->
		return Router.current().params.course

	myEmail: ->
		if Router.current().params.email?
			return Router.current().params.email

		return Meteor.user().emails[0].address

	url: ->
		email = Router.current().params.email
		email ?= Meteor.user().emails[0].address
		params = _.extend {email: email}, Router.current().params

		return Router.url('my', params, params)

	percentageDone: ->
		user = Meteor.user()
		if Router.current().params.email?
			user = Meteor.users.findOne({'emails.address': Router.current().params.email})

		if not user?
			return

		gradeCode = Session.get('grade').toUpperCase()
		if not gradeCode in ['SI', 'TSI']
			gradeCode = 'SI'

		query = {}
		query['code.' + gradeCode] = $exists: true
		grade = Grade.find(query).fetch()

		total = 0
		done = 0
		doing = 0
		electiveMax = 0

		if gradeCode is 'SI'
			electiveMax = 1

		for item in grade
			item = getItemOfCourse item
			if item.semester isnt 'E' or electiveMax-- > 0
				total++
				if user?.grade?[item._id] is 'done'
					done++
					doing++
				else if user?.grade?[item._id] is 'doing'
					doing++

		return {
			percentageDone: Math.round(100 / total * done)
			percentageDoing: Math.round(100 / total * doing)
			total: total
			done: done
			doing: doing
		}

	getItemOfCourse: ->
		return getItemOfCourse @


Template.Grade.events
	'change th > select': (e) ->
		status = $(e.target).val()

		if status is 'all'
			status = undefined

		route = Router.current()

		query = route.params.query
		if status?
			query.status = status
		else
			delete query.status

		Router.go route.route.getName(), route.params, {query: query}

	'click input.autoselect': (e) ->
		$(e.target).select()
