const { Client } = require('pg');

const SQL_Drop = `
DROP TABLE IF EXISTS MemberStatus CASCADE;
DROP TABLE IF EXISTS UserData;
DROP TABLE IF EXISTS UserMessage;
`;

const SQL_MemberStatus = `
CREATE TABLE IF NOT EXISTS MemberStatus (
 MemberStatusID SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 MemberStatusName VARCHAR(20) NOT NULL UNIQUE
 );

INSERT INTO MemberStatus (MemberStatusName)
VALUES  ('Guest'),
        ('Member'),
        ('Admin');
`;

const SQL_User = `
CREATE TABLE IF NOT EXISTS UserData (
 UserID BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 MemberStatusID SMALLINT REFERENCES MemberStatus(MemberStatusID),
 UserName VARCHAR(50) NOT NULL UNIQUE,
 UserPassword VARCHAR(255) NOT NULL,
 FirstName VARCHAR(50) NOT NULL,
 LastName VARCHAR(50) NOT NULL 
 );
`;

const SQL_Message = `
CREATE TABLE IF NOT EXISTS UserMessage (
 MessageID BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 UserID BIGINT REFERENCES UserData(UserID),
 Title VARCHAR(50) NOT NULL,
 MessageText TEXT NOT NULL,
 CreationDate TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);
`;

async function main() {
    const client = new Client({
        connectionString: process.argv[2]
    });
    console.log('Seeding...');
    await client.connect();
    await client.query(SQL_Drop);
    await client.query(SQL_MemberStatus);
    await client.query(SQL_User);
    await client.query(SQL_Message);
    await client.end();
    console.log('Done.');
}

main();