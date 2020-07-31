import { gql, ApolloProvider } from '@apollo/client';

export function writeInitialData(cache) {
	cache.writeQuery({
		query: gql`
      query GetTodosNetworkStatusAndFilter {
        targets
		categories
		timerHistory
		totalTime
		visibilityFilter
		colorTheme
		weekInfo {
			connected
			api
		}
		weekTargets
		settings
        networkStatus {
          isConnected
        }
      }
    `,
		data: {
			targets: [],
			categories: {},
			timerHistory: [],
			totalTime: 0.,
			visibilityFilter: 'SHOW_ALL',
			colorTheme:'dark',
			weekInfo: {
				connected: false,
				api: []
			},
			weekTargets: {},
			settings:{},
			networkStatus: {
				__typename: 'NetworkStatus',
				isConnected: false,
			},
		},
	});
}


// exports.writeInitialData = writeInitialData;