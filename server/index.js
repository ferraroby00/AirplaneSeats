"use strict";

const daoSeats = require("./dao-seats");
const daoPlanes = require("./dao-planes");
const daoUsers = require("./dao-users");

const express = require("express");
const session = require("express-session");
const { check } = require("express-validator");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const PORT = 3001;

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Cross-Origin Resource Sharing setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Passport setup
passport.use(
  new LocalStrategy(async function verify(username, password, callback) {
    const user = await daoUsers.getUser(username, password);
    if (!user) return callback(null, false, "Incorrect username or password");
    return callback(null, user);
  })
);

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) {
  callback(null, user);
});

// Starting from data in the session extract the logged-in user
passport.deserializeUser((user, callback) => callback(null, user));

// Session
app.use(
  session({
    secret: "-- session secret passphrase --",
    resave: false,
    saveUninitialized: false,
    cookie: { sameSite: "lax" },
  })
);

app.use(passport.authenticate("session"));

// Authentication verification middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

// Error handling middleware
const handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};
app.use(handleError);

/////////////////////////////////////////////////////////

// SEATS APIs

// Get all seats by plane type
app.get(
  "/api/seats/:type_id",
  [check("type_id").isInt({ min: 1, max: 3 })],
  async (req, res, next) => {
    try {
      const seats = await daoSeats.getSeats(req.params.type_id);
      res.json(seats);
    } catch (err) {
      next(err);
    }
  }
);

// Given the seat_id, return the user_id of the user who reserved it
app.get(
  "/api/validate/:seat_id",
  isLoggedIn,
  [check("seat_id").isInt({ min: 1, max: 310 })],
  async (req, res, next) => {
    try {
      const result = await daoSeats.validateSeat(req.params.seat_id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// Confirm reservation in the database
app.put(
  "/api/confirm",
  isLoggedIn,
  [check("seat_id").isInt({ min: 1, max: 310 })],
  async (req, res, next) => {
    try {
      await daoSeats.confirmReservation(req.user.id, req.body.seat_id);
      res.json({});
    } catch (err) {
      next(err);
    }
  }
);

// Delete reservation from the database given the user_id
app.delete(
  "/api/delete",
  isLoggedIn,
  [check("plane_type").isInt({ min: 1 })],
  async (req, res, next) => {
    try {
      await daoSeats.cancelReservation(req.user.id, req.body.plane_type);
      res.json({});
    } catch (err) {
      next(err);
    }
  }
);

/////////////////////////////////////////////////////////

// PLANES APIs

// Get all planes info
app.get("/api/planes", async (req, res, next) => {
  try {
    const planeInfo = await daoPlanes.getPlaneInfo();
    res.json(planeInfo);
  } catch (err) {
    next(err);
  }
});

/////////////////////////////////////////////////////////

// USERS APIs

// Login status check
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// Login
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.json(req.user);
    });
  })(req, res, next);
});

// Logout
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

/////////////////////////////////////////////////////////

// Activating the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
