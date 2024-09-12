const { Client } = require('pg');

// Replace with your actual CockroachDB connection string
const connection = new Client({
    connectionString:process.env.DB_STRING
});

// Connecting to CockroachDB
(async () => {
    try {
        await connection.connect();
        console.log('DB connection successful');
    } catch (error) {
        console.error('Error in DB:', error);
    }

})();



module.exports = connection;
