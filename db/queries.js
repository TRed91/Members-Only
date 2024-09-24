const pool = require('./pool');

const addUser = async ({username, firstname, lastname, pw}) => {
    await pool.query(`INSERT INTO userdata (MemberStatusID, UserName, UserPassword, FirstName, LastName)
                VALUES ('1', $1, $2, $3, $4);`, [ username, pw, firstname, lastname ]);
}

const upgradeUserMember = async (id) => {
    await pool.query(`UPDATE userdata SET MemberStatusID = 2 WHERE userid = $1;`, [id]);
}

const upgradeUserAdmin = async (id) => {
    await pool.query(`UPDATE userdata SET MemberStatusID = 3 WHERE userid = $1;`, [id]);
}

const writeMsg = async ({id, msgTitle, msg}) => {
    await pool.query(`INSERT INTO usermessage (UserID, Title, MessageText)
                        VALUES ($1, $2, $3);`, [id, msgTitle, msg]);
}

const getMessages = async () => {
     const { rows } = await pool.query(`
        SELECT username, title, messagetext, creationdate, messageid 
        FROM userdata u 
        INNER JOIN usermessage m ON u.userid = m.userid;
        `);
    return rows;
}

const deleteMessage = async (id) => {
    await pool.query(`DELETE FROM usermessage WHERE messageid = $1`, [id]);
}

module.exports = {
    addUser,
    upgradeUserMember,
    upgradeUserAdmin,
    writeMsg,
    getMessages,
    deleteMessage
}