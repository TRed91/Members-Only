const { Router } = require('express');
const router = Router();
const controller = require('../controllers/indexController');
const passport = require('passport');

router.get('/', controller.indexPageGet);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureMessage: true
}));

module.exports = router;