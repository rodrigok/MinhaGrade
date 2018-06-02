Blaze.registerHelper('log', function(...args1) {
	const adjustedLength = Math.max(args1.length, 1);
	const args = args1.slice(0, adjustedLength - 1);
	// const tpl = args1[adjustedLength - 1];

	return console.log.apply(console, args);
});
