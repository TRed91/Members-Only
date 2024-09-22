const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgres://thomasroth:seraphim@localhost:5432/membersonly'
});

module.exports = pool;