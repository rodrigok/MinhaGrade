import { Meteor } from 'meteor/meteor';

export class _BaseModel {
	constructor(nameOrCollection) {
		if (typeof nameOrCollection === 'string') {
			this.name = nameOrCollection;
			this.model = new Meteor.Collection(nameOrCollection);
		} else {
			this.model = nameOrCollection;
		}
	}

	find = (query = {}, options) => this.model.find(query, options)

	findOne = (query = {}, options) => this.model.findOne(query, options)

	create = (record) => this.insert(record)

	insert = (record) => this.model.insert(record)

	update = (query, update, options) => this.model.update(query, update, options)

	updateById = (_id, update) => this.model.update({ _id }, update)

	removeById = (_id) => this.model.remove({ _id })

	createAndReturn = (record) => this.findOne(this.insert(record))

	updateByIdAndReturn = (_id, update) => {
		this.update({ _id }, update);
		return this.findOne({ _id });
	}


	resolverFindAll = () => this.find().fetch()


	mutationCreate = (root, record) => this.createAndReturn(record)

	mutationUpdate = (root, { _id, ...record }) => this.updateByIdAndReturn(_id, record)

	mutationRemove = (root, { _id }) => this.removeById(_id)
}
