const mysql = require('mysql2/promise');

async function connectToMySQL() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Khan@1234',
        database: 'Webmobi'
    });
    console.log("Successfully Connected to MySQL.");
    return connection;
}

async function createUserTable() {
    try {
        const connection = await connectToMySQL();
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
      )
    `);
        console.log("User table created successfully.");
    } catch (error) {
        console.error("Error creating user table:", error);
    }
}

module.exports = {
    connectToMySQL,
    createUserTable
};
