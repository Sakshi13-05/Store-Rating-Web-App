const sql = require("mysql2");

const db = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com") ? {
        rejectUnauthorized: false
    } : undefined
});

db.connect((error) => {
    if (error) {
        console.error("connection with DB failed", error);
        return;
    }
    console.log("Connection with DB is successful");
});

module.exports = db;
