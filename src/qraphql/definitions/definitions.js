import { gql } from '@apollo/client';

const typeDefs = gql`

type Target {
  id: ID!
  title: String
  start: String
  end: String
  category: String
  timer: Boolean
  tasks: [Task]
}

type Task {
  title: String
  checked: Boolean
}

type Author {
  name: String
  books: [Book]
}

type Launch {
  id: ID!
  site: String
  mission: Mission
  rocket: Rocket
  isBooked: Boolean!
}

type Query {
  launches: [Launch]!
  launch(id: ID!): Launch
  me: User
}

type Mutation {
  bookTrips(launchIds: [ID]!): TripUpdateResponse!
  cancelTrip(launchId: ID!): TripUpdateResponse!
  login(email: String): String # login token
}

type TripUpdateResponse {
  success: Boolean!
  message: String
  launches: [Launch]
}

type Mission {
  name: String
  missionPatch(size: PatchSize): String
}

enum PatchSize {
  SMALL
  LARGE
}

`

export default typeDefs