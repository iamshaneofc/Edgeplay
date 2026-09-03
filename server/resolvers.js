const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'edgeplay-secret-key-2026';

const users = [];
const bets = [];
const standings = [
  {
    id: "st-1",
    user_id: "usr-1",
    user_name: "ProPredictor",
    weekly_count: 4500,
    monthly_count: 18500,
    alltime_count: 54000
  },
  {
    id: "st-2",
    user_id: "usr-2",
    user_name: "CryptoBettor",
    weekly_count: 3200,
    monthly_count: 14200,
    alltime_count: 41000
  }
];

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '30d' });
};

// Teams database
const teamsData = {
  // Football
  "tm-f1": { teamId: "tm-f1", leagueId: "leg-f1", name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg", foundingDate: "1902", address: "Madrid", area: "Spain", venue: "Santiago Bernabéu", capacity: 81044, coach: "Carlo Ancelotti", website: "realmadrid.com" },
  "tm-f2": { teamId: "tm-f2", leagueId: "leg-f1", name: "FC Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg", foundingDate: "1899", address: "Barcelona", area: "Spain", venue: "Camp Nou", capacity: 99354, coach: "Hansi Flick", website: "fcbarcelona.com" },
  "tm-f3": { teamId: "tm-f3", leagueId: "leg-f2", name: "Manchester City", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg", foundingDate: "1880", address: "Manchester", area: "England", venue: "Etihad Stadium", capacity: 53400, coach: "Pep Guardiola", website: "mancity.com" },
  "tm-f4": { teamId: "tm-f4", leagueId: "leg-f2", name: "Arsenal FC", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg", foundingDate: "1886", address: "London", area: "England", venue: "Emirates Stadium", capacity: 60704, coach: "Mikel Arteta", website: "arsenal.com" },
  "tm-f5": { teamId: "tm-f5", leagueId: "leg-f3", name: "Paris Saint-Germain", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg", foundingDate: "1970", address: "Paris", area: "France", venue: "Parc des Princes", capacity: 47929, coach: "Luis Enrique", website: "psg.fr" },
  "tm-f6": { teamId: "tm-f6", leagueId: "leg-f3", name: "Bayern Munich", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg", foundingDate: "1900", address: "Munich", area: "Germany", venue: "Allianz Arena", capacity: 75000, coach: "Vincent Kompany", website: "fcbayern.com" },
  
  // Basketball
  "tm-b1": { teamId: "tm-b1", leagueId: "leg-b1", name: "LA Lakers", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg", foundingDate: "1947", address: "Los Angeles", area: "USA", venue: "Crypto.com Arena", capacity: 19060, coach: "JJ Redick", website: "nba.com/lakers" },
  "tm-b2": { teamId: "tm-b2", leagueId: "leg-b1", name: "Golden State Warriors", logo: "https://upload.wikimedia.org/wikipedia/en/0/01/Golden_State_Warriors_logo.svg", foundingDate: "1946", address: "San Francisco", area: "USA", venue: "Chase Center", capacity: 18064, coach: "Steve Kerr", website: "nba.com/warriors" },
  "tm-b3": { teamId: "tm-b3", leagueId: "leg-b1", name: "Boston Celtics", logo: "https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg", foundingDate: "1946", address: "Boston", area: "USA", venue: "TD Garden", capacity: 19156, coach: "Joe Mazzulla", website: "nba.com/celtics" },
  "tm-b4": { teamId: "tm-b4", leagueId: "leg-b1", name: "Miami Heat", logo: "https://upload.wikimedia.org/wikipedia/en/f/fb/Miami_Heat_logo.svg", foundingDate: "1988", address: "Miami", area: "USA", venue: "Kaseya Center", capacity: 19600, coach: "Erik Spoelstra", website: "nba.com/heat" }
};

// Dynamic match data generator based on current time
const getDynamicMatches = () => {
  const now = Math.floor(Date.now() / 1000);

  return [
    // Football Matches
    {
      matchId: "m1",
      matchTime: now - 1800, // Live, started 30m ago
      halfStartTime: now - 1800,
      homeName: "Real Madrid",
      awayName: "FC Barcelona",
      status: "1", // In play
      homeLogo: teamsData["tm-f1"].logo,
      awayLogo: teamsData["tm-f2"].logo,
      moneyLine: "0,0,0,0,0,2.15,3.40,3.10,0,0,0",
      leagueName: "La Liga",
      homeScore: 2,
      awayScore: 1,
      homeId: "tm-f1",
      awayId: "tm-f2",
      sport: "football"
    },
    {
      matchId: "m2",
      matchTime: now + 7200, // In 2 hours
      halfStartTime: now + 7200,
      homeName: "Manchester City",
      awayName: "Arsenal FC",
      status: "0",
      homeLogo: teamsData["tm-f3"].logo,
      awayLogo: teamsData["tm-f4"].logo,
      moneyLine: "0,0,0,0,0,1.90,3.60,3.80,0,0,0",
      leagueName: "Premier League",
      homeScore: 0,
      awayScore: 0,
      homeId: "tm-f3",
      awayId: "tm-f4",
      sport: "football"
    },
    {
      matchId: "m3",
      matchTime: now + 18000, // In 5 hours
      halfStartTime: now + 18000,
      homeName: "Paris Saint-Germain",
      awayName: "Bayern Munich",
      status: "0",
      homeLogo: teamsData["tm-f5"].logo,
      awayLogo: teamsData["tm-f6"].logo,
      moneyLine: "0,0,0,0,0,2.40,3.50,2.75,0,0,0",
      leagueName: "UEFA Champions League",
      homeScore: 0,
      awayScore: 0,
      homeId: "tm-f5",
      awayId: "tm-f6",
      sport: "football"
    },

    // Basketball Matches
    {
      matchId: "mb1",
      matchTime: now - 2400, // Live, 40m ago
      halfStartTime: now - 2400,
      homeName: "LA Lakers",
      awayName: "Golden State Warriors",
      status: "1",
      homeLogo: teamsData["tm-b1"].logo,
      awayLogo: teamsData["tm-b2"].logo,
      moneyLine: "0,0,0,0,1.85,1.95,0,0,0,0,0",
      leagueName: "NBA",
      homeScore: 88,
      awayScore: 84,
      homeId: "tm-b1",
      awayId: "tm-b2",
      sport: "basketball"
    },
    {
      matchId: "mb2",
      matchTime: now + 10800, // In 3 hours
      halfStartTime: now + 10800,
      homeName: "Boston Celtics",
      awayName: "Miami Heat",
      status: "0",
      homeLogo: teamsData["tm-b3"].logo,
      awayLogo: teamsData["tm-b4"].logo,
      moneyLine: "0,0,0,0,1.65,2.25,0,0,0,0,0",
      leagueName: "NBA",
      homeScore: 0,
      awayScore: 0,
      homeId: "tm-b3",
      awayId: "tm-b4",
      sport: "basketball"
    }
  ];
};

const resolvers = {
  Query: {
    getMe: (_, { jsWebToken }) => {
      try {
        const decoded = jwt.verify(jsWebToken, SECRET_KEY);
        const user = users.find(u => u.id === decoded.id || u.email === decoded.email);
        if (user) return user;
      } catch (e) {}
      return users[0] || null;
    },

    getBet: (_, { jsWebToken, pending }) => {
      try {
        const decoded = jwt.verify(jsWebToken, SECRET_KEY);
        return bets.filter(b => b.userId === decoded.id && (pending ? b.status === "PENDING" : b.status !== "PENDING"));
      } catch (e) {
        return bets;
      }
    },

    standing: (_, { orderBy, take }) => {
      let result = [...standings];
      if (orderBy && orderBy.field) {
        const field = orderBy.field;
        const isAsc = orderBy.order === 'asc';
        result.sort((a, b) => isAsc ? (a[field] - b[field]) : (b[field] - a[field]));
      }
      if (take && take > 0) {
        result = result.slice(0, take);
      }
      return result;
    },

    upcomingGames: (_, { data }) => {
      const sport = (data && data.sport) ? data.sport.toLowerCase() : "football";
      const matches = getDynamicMatches();
      return matches.filter(m => m.sport === sport || (sport === "football" && m.sport !== "basketball"));
    },

    scheduledGamesCount: (_, { sport }) => {
      const sportName = sport ? sport.toLowerCase() : "football";
      const matches = getDynamicMatches();
      return matches.filter(m => m.sport === sportName).length;
    },

    leagues: (_, { sport }) => {
      const sportName = sport ? sport.toLowerCase() : "football";
      if (sportName === "basketball") {
        return [
          {
            leagueId: "leg-b1",
            logo: "https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg",
            country: "USA",
            scheduledGames: 2,
            leagueName: "NBA",
            name: "NBA",
            matchIds: ["mb1", "mb2"]
          }
        ];
      }
      return [
        {
          leagueId: "leg-f1",
          logo: "https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_EA_Sports_2023_Logo.svg",
          country: "Spain",
          scheduledGames: 1,
          leagueName: "La Liga",
          name: "La Liga",
          matchIds: ["m1"]
        },
        {
          leagueId: "leg-f2",
          logo: "https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg",
          country: "England",
          scheduledGames: 1,
          leagueName: "Premier League",
          name: "Premier League",
          matchIds: ["m2"]
        },
        {
          leagueId: "leg-f3",
          logo: "https://upload.wikimedia.org/wikipedia/en/b/bf/UEFA_Champions_League_logo_2021.svg",
          country: "Europe",
          scheduledGames: 1,
          leagueName: "UEFA Champions League",
          name: "UEFA Champions League",
          matchIds: ["m3"]
        }
      ];
    },

    matchOdds: (_, { sport, matchId }) => {
      const sportName = sport ? sport.toLowerCase() : "football";
      if (sportName === "basketball") {
        return {
          spread: ["0", "0", "0", "0,0,0,0,0,0,0,0,4.5,1.85,1.95"],
          moneyLine: "0,0,0,0,1.85,1.95,0,0,0,0,0",
          total: ["0", "0", "0", "0,0,0,0,0,0,0,0,215.5,1.90,1.90"],
          handicap: ["0", "0", "0", "0,0,0,0,0,0,0,0,4.5,1.85,1.95"],
          europeOdds: ["1.85", "1.95"],
          overUnder: ["0", "0", "0", "0,0,0,0,0,0,0,0,215.5,1.90,1.90"],
          handicapHalf: ["0", "0", "0", "0,0,0,0,0,0,0,0,2.5,1.85,1.95"],
          overUnderHalf: ["0", "0", "0", "0,0,0,0,0,0,0,0,108.5,1.90,1.90"]
        };
      }
      return {
        spread: ["0", "0", "0", "0,0,0,0,0,0.5,1.90,1.95"],
        moneyLine: "0,0,0,0,0,2.15,3.40,3.10,0,0,0",
        total: ["0", "0", "0", "0,0,0,0,0,2.5,1.85,2.00"],
        handicap: ["0", "0", "0", "0,0,0,0,0,-0.5,1.90,1.95"],
        europeOdds: ["2.15", "3.40", "3.10"],
        overUnder: ["0", "0", "0", "0,0,0,0,0,2.5,1.85,2.00"],
        handicapHalf: ["0", "0", "0", "0,0,0,0,0,-0.25,1.85,1.95"],
        overUnderHalf: ["0", "0", "0", "0,0,0,0,0,1.0,1.80,2.05"]
      };
    },

    matchBasicInfo: (_, { sport, matchId }) => {
      const matches = getDynamicMatches();
      if (Array.isArray(matchId) && matchId.length > 0) {
        return matches.filter(m => matchId.includes(m.matchId));
      }
      const sportName = sport ? sport.toLowerCase() : "football";
      return matches.filter(m => m.sport === sportName);
    },

    getLiveTVConfig: () => {
      return JSON.stringify({ enabled: true });
    },

    getTeam: (_, { teamId }) => {
      return teamsData[teamId] || {
        teamId: teamId || "tm-unknown",
        leagueId: "leg-f1",
        name: "Sports Team",
        logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
        foundingDate: "1900",
        address: "City",
        area: "Country",
        venue: "Stadium",
        capacity: 50000,
        coach: "Head Coach",
        website: "sports.com"
      };
    },

    getMyPosition: () => {
      return { position: 1 };
    }
  },

  Mutation: {
    signupUser: (_, { data }) => {
      const { email, name, password } = data;
      const lowerEmail = email.toLowerCase();
      
      const existingUser = users.find(u => u.email === lowerEmail);
      if (existingUser) {
        throw new Error("An account already exists with that email!");
      }

      const newUser = {
        id: "usr_" + Date.now(),
        name: name || lowerEmail.split('@')[0],
        email: lowerEmail,
        password: password,
        coins: 1000,
        bet_won: 0,
        bet_lost: 0,
        bet_pending: 0,
        invite_code: Math.random().toString(36).substring(2, 8).toUpperCase()
      };

      users.push(newUser);
      const token = generateToken(newUser);
      return { token, user: newUser };
    },

    login: (_, { data }) => {
      const { email, password } = data;
      const lowerEmail = email.toLowerCase();
      const user = users.find(u => u.email === lowerEmail);
      
      if (!user || user.password !== password) {
        throw new Error("Incorrect email or password.");
      }

      const token = generateToken(user);
      return { token, user };
    },

    facebookLogin: (_, { data }) => {
      const { name, facebookId } = data;
      let user = users.find(u => u.facebookId === facebookId);
      
      if (!user) {
        user = {
          id: "fb_" + Date.now(),
          name,
          email: `${facebookId}@facebook.com`,
          coins: 1000,
          bet_won: 0,
          bet_lost: 0,
          bet_pending: 0,
          facebookId
        };
        users.push(user);
      }

      const token = generateToken(user);
      return { token, user };
    },

    makeBet: (_, { jsWebToken, data }) => {
      let userId = "usr-1";
      try {
        const decoded = jwt.verify(jsWebToken, SECRET_KEY);
        userId = decoded.id;
      } catch (e) {}

      const newBet = {
        id: "bet_" + Date.now(),
        userId,
        bid: data.bid,
        gameId: data.gameId,
        betType: data.betType,
        pick: data.pick,
        pickName: data.pickName,
        odd: data.odd,
        gameType: data.gameType,
        teams: data.teams,
        spread: data.spread || null,
        total: data.total || null,
        status: "PENDING",
        outcome: "Awaiting Result"
      };

      bets.push(newBet);
      return newBet;
    },

    addCoins: (_, { jsWebToken, data }) => {
      try {
        const decoded = jwt.verify(jsWebToken, SECRET_KEY);
        const user = users.find(u => u.id === decoded.id);
        if (user) {
          user.coins += data.amount;
        }
      } catch (e) {}
      return true;
    },

    saveDeviceInfo: () => true,
    saveLocation: () => true,
    saveContacts: () => true,
    updateUser: () => true
  }
};

module.exports = resolvers;

