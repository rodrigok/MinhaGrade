Template.Layout.helpers
	isActive: (grade) ->
		if Session.get('grade')?.toLowerCase() is grade
			return 'active'
