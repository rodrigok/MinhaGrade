import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { MeteorLink } from 'meteor/swydo:ddp-apollo';

export const client = new ApolloClient ({
	link: new MeteorLink(),
	cache: new InMemoryCache()
});
