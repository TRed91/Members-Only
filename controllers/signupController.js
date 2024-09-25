const db = require('../db/queries');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const alphaErr = 'Must only contain letters';

const validateUser = [
    body('username').trim(),
    body('firstname').trim()
        .isAlpha().withMessage(`First Name ${alphaErr}`),
    body('lastname').trim()
        .isAlpha().withMessage(`Last Name ${alphaErr}`),
    body('pw').trim()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('cpw').trim()
        .custom((cpw, {req}) => cpw === req.body.pw).withMessage('Passwords must match.')
];

exports.pageGet = (req, res) => {
    res.render('signup', {user: req.user});
}

exports.createUserPost = [
    validateUser,
    (req, res) => {
        const { username, firstname, lastname, pw, cpw } = req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).render('signup', { errors: errors.array() });
        }

        bcrypt.hash(pw, 10, async (err, hashedPassword) => {
            if (err) {
                console.error('Hashing error: ', err.message);
            }
            try {
                await db.addUser({ username: username, firstname: firstname, lastname: lastname, pw: hashedPassword });
                console.log(`Added user: ${req.body.username}`);
                res.redirect('/');
            } catch (err) {
                console.log('DB write error: ', err.message);
                res.redirect('/sign-up');
            }
        });  
    }
];
