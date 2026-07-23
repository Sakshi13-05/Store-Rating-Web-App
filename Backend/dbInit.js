require("dotenv").config();
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com") ? {
        rejectUnauthorized: false
    } : undefined
});

const executeQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

async function init() {
    try {
        console.log("Connecting to the database...");
        connection.connect();
        console.log("Connected successfully. Creating tables...");

        // 1. Create users table
        await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
        console.log("- Table 'users' created or verified.");

        // 2. Create stores table
        await executeQuery(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        address TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        owner_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
        console.log("- Table 'stores' created or verified.");

        // 3. Create ratings table
        await executeQuery(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_store (user_id, store_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
        console.log("- Table 'ratings' created or verified.");

        // 4. Seed demo users
        console.log("Seeding demo users...");

        const usersToSeed = [
            { name: "RateNest Admin", email: "admin@ratenest.com", password: "RateNestAdmin!1", role: "admin", address: "System Headquarters" },
            { name: "Maria Customer", email: "maria@ratenest.com", password: "Maria@123456", role: "user", address: "123 Main St, New York" },
            { name: "Harlow Owner", email: "harlow@ratenest.com", password: "Harlow@12345", role: "owner", address: "456 Oak Ave, California" }
        ];

        for (const u of usersToSeed) {
            const existing = await executeQuery("SELECT id FROM users WHERE email = ?", [u.email]);
            if (existing.length === 0) {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                await executeQuery(
                    "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
                    [u.name, u.email, hashedPassword, u.address, u.role]
                );
                console.log(`  + Seeded user: ${u.email} (${u.role})`);
            } else {
                console.log(`  . User ${u.email} already exists.`);
            }
        }

        console.log("Database initialized successfully!");
    } catch (error) {
        console.error("Initialization failed:", error);
    } finally {
        connection.end();
    }
}

init();
