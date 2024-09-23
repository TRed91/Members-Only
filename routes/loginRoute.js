const { Router } = require('express');
const router = Router();
const controller = require('../controllers/loginController');
const passport = require('passport');

router.get('/', controller.loginPageGet);
router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

module.exports = router;