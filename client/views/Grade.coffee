Template.Grade.helpers
	grade: ->
		grade = Session.get('grade').toUpperCase()
		if not grade in ['SI', 'TSI']
			grade = 'SI'

		return Grade.find({course: grade}, {sort: {_id: 1}})

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
		return Meteor.user().emails[0].address

	url: ->
		params = _.extend {email: Meteor.user().emails[0].address}, Router.current().params

		return Router.url('my', params, params)

	percentageDone: ->
		user = Meteor.user()
		if Router.current().params.email?
			user = Meteor.users.findOne({'emails.address': Router.current().params.email})

		if not user?
			return

		grade = Session.get('grade').toUpperCase()
		if not grade in ['SI', 'TSI']
			grade = 'SI'

		grade = Grade.find({course: grade}).fetch()

		total = 0
		done = 0
		doing = 0

		for item in grade
			if item.semester isnt 'E'
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
