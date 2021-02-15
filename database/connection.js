const { Client } = require('pg');

const client = new Client({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASS,
    port: process.env.DBPORT
})


console.log("u :::: ",process.env.USER);
client.connect()
.then(()=>console.log("Database connected"))
.catch(err=>console.error("Database error :: ",err));

module.exports = client;