const pool = require('./pool');

const addUser = async ({username, firstname, lastname, pw}) => {
    await pool.query(`INSERT INTO userdata (MemberStatusID, UserName, UserPassword, FirstName, LastName)
                VALUES ('1', $1, $2, $3, $4);`, [ username, pw, firstname, lastname ]);
}

const upgradeUser = async (id) => {
    await pool.query(`UPDATE userdata SET MemberStatusID = 2 WHERE userid = $1`, [id]);
}

module.exports = {
    addUser,
    upgradeUser
}