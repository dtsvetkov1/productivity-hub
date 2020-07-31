import React, { useState, useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import moment from 'moment-timezone';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { persistCache } from 'apollo-cache-persist';

import Scrum from './containers/Scrum/Scrum';
import Calendar from './containers/Calendar/Calendar';
import Tasks from './containers/Advance/Tasks';
import Settings from './containers/Settings/Settings';
import Home from './containers/Home/Home';


import typeDefs from './qraphql/definitions/definitions';
import {writeInitialData} from './qraphql/definitions/initial';
import {Mutation} from './qraphql/resolvers/mutations';
import {Query} from './qraphql/resolvers/queries';



function App() {
	const [client, setClient] = useState(null);
	const [currentTime, setCurrentTime] = useState(moment())

	useEffect(() => {
		async function persist() {
			const cache = new InMemoryCache()

			const client = new ApolloClient({
				typeDefs,
				cache,
				resolvers: {
					Query: Query,
					Mutation: Mutation
				},
				
			});

			writeInitialData(cache);
			await persistCache({
				cache,
				storage: window.localStorage,
			});
			setClient(client)
		}

		persist()

	}, []);

	useEffect(() => {
		setInterval(() => setCurrentTime(moment()), 1000)
	}, [])

	if (!client) { return <div></div> }

	return (
		<ApolloProvider client={client}>
			<Router>
				{/* <div style={{ position: 'relative', margin:0 }} className="App"> */}
					<Switch>
						<Route path="/calendar">
							<Calendar />
						</Route>
						<Route path="/scrum">
							<Scrum />
						</Route>
						<Route path="/tasks">
							<Tasks />
						</Route>
						<Route path="/settings">
							<Settings />
						</Route>
						<Route path="/">
							<Home currentTime={currentTime} />
						</Route>
					</Switch>
				{/* </div> */}
			</Router>
		</ApolloProvider>

	);
}

export default App;
