Blaze.registerHelper('getCourse', function(obj) {
	const grade = Session.get('grade').toUpperCase();

	if (Match.test(obj, Object)) {
		return obj[grade];
	}

});
