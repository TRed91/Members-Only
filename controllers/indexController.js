const db = require('../db/queries');

exports.indexPageGet = async (req, res) => {
    const messages = await db.getMessages();
    const errMessages = req.session.messages || null;
    if (errMessages)
        res.render('index', {user: req.user, 
                            errMsg: errMessages[errMessages.length - 1], 
                            messages: messages });
    else
        res.render('index', {user: req.user,
                            messages: messages });
}

exports.deleteMessage = async (req, res) => {
    try {
        await db.deleteMessage(req.body.msgDeleteID);
        res.redirect('/');
    } catch (err) {
        console.log('Delete Message Error: ', err.message);
        res.redirect('/');
    }
}