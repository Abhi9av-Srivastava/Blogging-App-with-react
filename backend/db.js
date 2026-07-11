const mysql = require("mysql2");

const dbName = "bloggingapp";
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "abhinavsrivastava@890"
});

module.exports = db;

db.connect((err) => {
    if (err) {
        console.error("Database connection error", err);
        return;
    }

    db.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (createErr) => {
        if (createErr) {
            console.error("Failed to create database", createErr);
            return;
        }

        db.query(`USE \`${dbName}\``, (useErr) => {
            if (useErr) {
                console.error("Failed to select database", useErr);
                return;
            }

            db.query(`
                CREATE TABLE IF NOT EXISTS posts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `, (tableErr) => {
                if (tableErr) {
                    console.error("Failed to create posts table", tableErr);
                    return;
                }

                console.log("MySQL Connected");
            });
        });
    });
});