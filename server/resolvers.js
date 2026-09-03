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
    saveContacts: () => true
  }
};

module.exports = resolvers;
