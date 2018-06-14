import { setup as createApolloServer } from 'meteor/swydo:ddp-apollo';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from '/api/schema.graphql';
import { resolvers } from '/api/resolvers';

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

createApolloServer({
	schema
});
