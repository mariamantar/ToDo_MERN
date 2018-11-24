import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from 'react-apollo';
import App from './App';
import * as serviceWorker from './serviceWorker';

// all queries re sent to grqhql when we type this
const client = new ApolloClient({
    uri: "http://localhost:4000"
  });

//ApolloProvider wraps our entire app
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

serviceWorker.unregister();
