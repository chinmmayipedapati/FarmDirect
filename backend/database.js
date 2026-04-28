const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'farmdirect.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create tables
        db.serialize(() => {
            // Users table (Role: Farmer or Customer)
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                phone TEXT UNIQUE,
                location TEXT
            )`);

            // Products table
            db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                farmerId INTEGER,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL,
                unit TEXT NOT NULL,
                imageUrl TEXT,
                FOREIGN KEY(farmerId) REFERENCES users(id)
            )`);

            // Seed Mock Data if empty
            db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
                if (row.count === 0) {
                    db.run(`INSERT INTO users (name, role, phone, location) VALUES 
                        ('Ramesh Rao', 'Farmer', '9876543210', 'Pune, Maharashtra'),
                        ('Aditi Sharma', 'Customer', '9988776655', 'Mumbai, Maharashtra')
                    `);
                    console.log('Seeded Users Data');
                }
            });

            db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
                if (row.count === 0) {
                    db.run(`INSERT INTO products (farmerId, name, category, price, quantity, unit, imageUrl) VALUES 
                        (1, 'Organic Tomatoes', 'Vegetables', 40.0, 50, 'kg', '/images/tomato.jpg'),
                        (1, 'Fresh Wheat', 'Grains', 35.0, 200, 'kg', '/images/wheat.jpg')
                    `);
                    console.log('Seeded Products Data');
                }
            });
        });
    }
});

module.exports = db;
