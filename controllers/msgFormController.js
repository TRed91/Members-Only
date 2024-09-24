const db = require('../db/queries');

exports.newMsgPageGet = (req, res) => {
    res.render('msgForm');
}

exports.newMsgPagePost = async (req, res) => {
    const { msgTitle, msg } = req.body;
    const id = req.user.userid;
    await db.writeMsg({id: id ,msgTitle: msgTitle, msg: msg});
    console.log(`New Message by UserID: ${id}.`);
    res.redirect('/');
}