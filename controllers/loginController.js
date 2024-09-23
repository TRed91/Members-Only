const db = require('../db/queries');

exports.loginPageGet = (req, res) => {
    console.log(req.session.messages);
    res.render('login', {user: req.user});
}
