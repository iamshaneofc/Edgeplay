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

  type UpcomingGame {
    matchId: String!
    matchTime: Float!
    halfStartTime: Float
    awayName: String!
    homeName: String!
    status: String!
    homeLogo: String
    awayLogo: String
    moneyLine: String
    leagueName: String!
    homeScore: Int
    awayScore: Int
    homeId: String
    awayId: String
  }

  type League {
    leagueId: String!
    logo: String
    country: String!
    scheduledGames: Int!
    leagueName: String!
    name: String!
    matchIds: [String!]!
  }

  type MatchOdds {
    spread: [String!]
    moneyLine: String
    total: [String!]
    handicap: [String!]
    europeOdds: [String!]
    overUnder: [String!]
    handicapHalf: [String!]
    overUnderHalf: [String!]
  }

  type Team {
    teamId: String!
    leagueId: String!
    name: String!
    logo: String
    foundingDate: String
    address: String
    area: String
    venue: String
    capacity: Int
    coach: String
    website: String
  }

  type UserPosition {
    position: Int!
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

  input UpCommingGameInput {
    sport: String!
  }

  input UserUpdateInput {
    fcmtoken: String
    name: String
    email: String
  }

  input LocationInput {
    accuracy: String
    altitude: String
    heading: String
    latitude: String
    longitude: String
    speed: String
  }

  input contactsInput {
    name: String
    number: String
  }

  input DeviceInput {
    model: String
    apiLevel: String
    brand: String
    buildNumber: String
    bootloader: String
    carrier: String
    codeName: String
    display: String
    name: String
    token: String
    appFirstInstall: String
    freeStorage: String
    hardward: String
    host: String
    appLastUpdated: String
    osVersion: String
    buildId: String
    capacity: String
    islocationEnabled: Boolean
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
    upcomingGames(jsWebToken: String!, data: UpCommingGameInput!): [UpcomingGame!]!
    scheduledGamesCount(jsWebToken: String!, sport: String!): Int!
    leagues(jsWebToken: String!, sport: String!): [League!]!
    matchOdds(jsWebToken: String!, sport: String!, matchId: String!): MatchOdds
    matchBasicInfo(jsWebToken: String!, sport: String!, matchId: [String!]): [UpcomingGame!]!
    getLiveTVConfig(jsWebToken: String!): String
    getTeam(jsWebToken: String!, sport: String!, teamId: String!): Team
    getMyPosition(jsWebToken: String!, orderBy: standingOrderByInput!): UserPosition!
  }

  type Mutation {
    signupUser(data: SignupInput!): AuthPayload!
    login(data: LoginInput!): AuthPayload!
    facebookLogin(data: FacebookLoginInput!): AuthPayload!
    makeBet(jsWebToken: String!, data: MakeBetInput!): Bet!
    addCoins(jsWebToken: String!, data: AddCoinsInput!): Boolean
    saveDeviceInfo(jsWebToken: String!, data: DeviceInput): Boolean
    saveLocation(jsWebToken: String!, data: LocationInput): Boolean
    saveContacts(jsWebToken: String!, data: [contactsInput!]): Boolean
    updateUser(jsWebToken: String!, data: UserUpdateInput!): Boolean
  }
`;

module.exports = typeDefs;

