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
router.post('/delete', controller.deleteMessage);
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;