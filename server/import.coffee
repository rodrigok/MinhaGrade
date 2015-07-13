Meteor.methods
	'import': ->
		if not @userId
			return

		si = JSON.parse Assets.getText 'si.json'
		tsi = JSON.parse Assets.getText 'tsi.json'

		si = si.concat tsi
		for item in si
			Grade.upsert {_id: item._id}, item