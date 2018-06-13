import { setup as createApolloServer } from 'meteor/swydo:ddp-apollo';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from '/imports/api/schema.graphql';
import { resolvers } from '/imports/api/resolvers';

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

createApolloServer({
	schema
});
