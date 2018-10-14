import { combineResolvers } from 'apollo-resolvers';
import { setupHttpEndpoint } from 'meteor/swydo:ddp-apollo';
import { makeExecutableSchema } from 'graphql-tools';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { initAccounts } from 'meteor/nicolaslopezj:apollo-accounts';
import { getSchema } from 'graphql-loader';

const WS_PORT = 5000;

import typeDefs from './schema.graphql';
import { resolvers } from './resolvers';

initAccounts({
	loginWithFacebook: true,
	loginWithGoogle: false,
	loginWithLinkedIn: false,
	loginWithPassword: true,
});

const { resolvers: resolversAccounts } = getSchema();

const resolversCombined = combineResolvers([
	resolvers,
	resolversAccounts,
]);

const schema = makeExecutableSchema({
	typeDefs,
	resolvers: resolversCombined,
});

const websocketServer = createServer((request, response) => {
	response.writeHead(404);
	response.end();
});

websocketServer.listen(WS_PORT, () => console.log(
	`Websocket Server is now running on http://localhost:${ WS_PORT }`
));

import { getUserIdByLoginToken } from '../getUserByLoginToken';


SubscriptionServer.create({
	schema,
	execute,
	subscribe,
	onConnect: (connectionParams) => {
		if (connectionParams.authToken) {
			return getUserIdByLoginToken(connectionParams.authToken)
				.then((userId) => ({
					userId,
				}));
		}

		throw new Error('Missing auth token!');
	},
}, {
	server: websocketServer,
	path: '/subscriptions',
});

setupHttpEndpoint({
	schema,
});
