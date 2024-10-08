const db = require('../db/queries');

exports.secretPageGet = (req, res) => {
    if (!req.user) {
        res.redirect('/');
    } else {
        res.render('secret', { user: req.user });
    }
}

exports.secretPagePost = async (req, res) => {
    if (req.body.secret === 'admin') {
        try {
            await db.upgradeUserAdmin(req.user.userid);
            console.log(`Upgrade user ${req.user.username} to 'admin'`);
            res.redirect('/');
        } catch (err) {
            console.error("Upgrade error: ", err.message);
            res.redirect('/secret')
        }
    } else if (req.body.secret === 'secret'){
        try {
            await db.upgradeUserMember(req.user.userid);
            console.log(`Upgrade user ${req.user.username} to 'member'`);
            res.redirect('/');
        } catch (err) {
            console.error("Upgrade error: ", err.message);
            res.redirect('/secret')
        }
    } else {
        res.render('secret', { user: req.user, msg: 'Incorrect secret password' });
    }
}