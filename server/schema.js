const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    coins: Int!
    bet_won: Int
    bet_lost: Int
    bet_pending: Int
    invite_code: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Bet {
    id: ID!
    bid: Int!
    gameId: String!
    betType: Int!
    pick: Int!
    pickName: String!
    odd: Float!
    gameType: Int!
    status: String
    outcome: String
    teams: String!
    spread: Float
    total: Float
  }

  type Standing {
    id: ID!
    user_id: ID!
    user_name: String!
    weekly_count: Int!
    monthly_count: Int!
    alltime_count: Int!
  }

  input SignupInput {
    name: String!
    email: String!
    password: String!
    invitedBy: String
    fcmtoken: String
  }

  input LoginInput {
    email: String!
    password: String!
    fcmtoken: String
  }

  input FacebookLoginInput {
    name: String!
    facebookId: String!
  }

  input MakeBetInput {
    gameId: String!
    betType: Int!
    bid: Int!
    odd: Float!
    gameType: Int!
    pick: Int!
    pickName: String!
    teams: String!
    spread: Float
    total: Float
  }

  input AddCoinsInput {
    amount: Int!
  }

  enum StandingOrderField {
    weekly_count
    monthly_count
    alltime_count
  }

  enum SortOrder {
    asc
    desc
  }

  input standingOrderByInput {
    field: StandingOrderField
    order: SortOrder
  }

  type Query {
    getMe(jsWebToken: String!): User
    getBet(jsWebToken: String!, pending: Boolean!): [Bet!]!
    standing(jsWebToken: String!, orderBy: standingOrderByInput, take: Int): [Standing!]!
  }

  type Mutation {
    signupUser(data: SignupInput!): AuthPayload!
    login(data: LoginInput!): AuthPayload!
    facebookLogin(data: FacebookLoginInput!): AuthPayload!
    makeBet(jsWebToken: String!, data: MakeBetInput!): Bet!
    addCoins(jsWebToken: String!, data: AddCoinsInput!): Boolean
    saveDeviceInfo(jsWebToken: String!): Boolean
    saveLocation(jsWebToken: String!, latitude: Float, longitude: Float): Boolean
    saveContacts(jsWebToken: String!): Boolean
  }
`;

module.exports = typeDefs;
