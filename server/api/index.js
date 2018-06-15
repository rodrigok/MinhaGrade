import a, { setupHttpEndpoint, setup as createGraphQLPublication } from 'meteor/swydo:ddp-apollo';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './schema.graphql';
import { resolvers } from './resolvers';

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

setupHttpEndpoint({
	schema
});

createGraphQLPublication({
	schema
});
