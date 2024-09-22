const pool = require('./pool');

const addUser = async ({username, firstname, lastname, pw}) => {
    await pool.query(`INSERT INTO userdata (MemberStatusID, UserName, UserPassword, FirstName, LastName)
                VALUES ('2', $1, $2, $3, $4);`, [ username, pw, firstname, lastname ]);
}

module.exports = {
    addUser
}