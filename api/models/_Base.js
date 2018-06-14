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

	find = (query = {}, options) => {
		return this.model.find(query, options);
	}

	findOne = (query = {}, options) => {
		return this.model.findOne(query, options);
	}

	create = (record) => {
		return this.insert(record);
	}

	insert = (record) => {
		return this.model.insert(record);
	}

	update = (query, update, options) => {
		return this.model.update(query, update, options);
	}

	updateById = (_id, update) => {
		return this.model.update({ _id }, update);
	}

	removeById = (_id) => {
		return this.model.remove({ _id });
	}

	createAndReturn = (record) => {
		return this.findOne(this.insert(record));
	}

	updateByIdAndReturn = (_id, update) => {
		this.update({ _id }, update);
		return this.findOne({ _id });
	}


	resolverFindAll = () => {
		return this.find().fetch();
	}


	mutationCreate = (root, record) => {
		return this.createAndReturn(record);
	}

	mutationUpdate = (root, { _id, ...record }) => {
		return this.updateByIdAndReturn(_id, record);
	}

	mutationRemove = (root, { _id }) => {
		return this.removeById(_id);
	}
}
