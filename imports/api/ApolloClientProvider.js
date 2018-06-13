import ApolloClient from 'apollo-client';
import { DDPLink } from 'meteor/swydo:ddp-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';

export const client = new ApolloClient ({
	link: new DDPLink(),
	cache: new InMemoryCache()
});
