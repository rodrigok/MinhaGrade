Migrations.add({
	version: 1,
	up() {
		const courses = JSON.parse(Assets.getText('courses.json'));

		Grade.remove({});

		return Array.from(courses).map((item) =>
			Grade.insert(item));
	}
});