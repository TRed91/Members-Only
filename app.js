const express = require('express');
require('dotenv').config();
const path = require('node:path');
const pool = require('./db/pool');
const signupRoute = require('./routes/signupRoute');
const session = require('express-session');
const pgStore = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static('public'));

app.use(session({
    store: new pgStore({
        pool: pool,
        createTableIfMissing: true
    }),
    secret: 'onlymembers',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

passport.use(
    new LocalStrategy(async(username, password, done) => {
        try {
            const { rows } = await pool.query('SELECT * FROM UserData WHERE UserName = $1', [username]);
            const user = rows[0];
            const match = bcrypt.compare(password, user.userpassword);
            if (!user) {
                return done(null, false, { message: 'Wrong username'});
            }
            if (!match) {
                return done(null, false, { message: 'Wrong password' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    return done(null, user.userid);
});

passport.deserializeUser(async(id, done) => {
    try {
        const { rows } = await pool.query('SELECT * FROM UserData WHERE UserID = $1', [id]);
        const user = rows[0];
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

app.use('/sign-up', signupRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Express app listening to port ${PORT}`)});