const pool = require('./pool');

const addUser = async ({username, firstname, lastname, pw}) => {
    await pool.query(`INSERT INTO userdata (MemberStatusID, UserName, UserPassword, FirstName, LastName)
                VALUES ('1', $1, $2, $3, $4);`, [ username, pw, firstname, lastname ]);
}

const upgradeUser = async (id) => {
    await pool.query(`UPDATE userdata SET MemberStatusID = 2 WHERE userid = $1;`, [id]);
}

const writeMsg = async ({id, msgTitle, msg}) => {
    await pool.query(`INSERT INTO usermessage (UserID, Title, MessageText)
                        VALUES ($1, $2, $3);`, [id, msgTitle, msg]);
}

const getMessages = async () => {
     const { rows } = await pool.query(`
        SELECT username, title, messagetext, creationdate 
        FROM userdata u 
        INNER JOIN usermessage m ON u.userid = m.userid;
        `);
    return rows;
}

module.exports = {
    addUser,
    upgradeUser,
    writeMsg,
    getMessages
}