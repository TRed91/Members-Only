const express = require('express');
require('dotenv').config();
const path = require('node:path');
const pool = require('./db/pool');
const session = require('express-session');
const pgStore = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const signupRoute = require('./routes/signupRoute');
const secretRoute = require('./routes/secretRoute');
const indexRoute = require('./routes/indexRoute');
const newMessageRoute = require('./routes/newMessageRoute');

const app = express();

// Use ejs views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Use static files
app.use(express.static('public'));

// Session handling
    // save session in db
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

// Define local strategy
passport.use(
    new LocalStrategy(async(username, password, done) => {
        try {
            const { rows } = await pool.query('SELECT * FROM UserData WHERE UserName = $1', [username]);
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: 'Wrong username'});
            }
            
            const match = await bcrypt.compare(password, user.userpassword);

            if (!match) {
                return done(null, false, { message: 'Wrong password' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// use cookie to authorize logged in users
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

// Use routes
app.use('/', indexRoute);
app.use('/sign-up', signupRoute);
app.use('/secret', secretRoute);
app.use('/new-message', newMessageRoute);
app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// Listen to post
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {console.log(`Express app listening to port ${PORT}`)});