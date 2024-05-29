const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const moment = require('moment'); 

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'user_management'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        user_role VARCHAR(100),
        status ENUM('active', 'inactive') DEFAULT 'active',
        social_profile JSON,
        promote BOOLEAN DEFAULT false,
        rating INT DEFAULT 0,
        last_login DATETIME
    )
`;
db.query(createUserTable, (err, result) => {
    if (err) throw err;
    console.log('User table created or already exists');
});

app.post('/api/users', (req, res) => {
    const { username, user_role, status, social_profile, promote, rating, last_login } = req.body;

    // Convert last_login to MySQL DATETIME format
    const formattedLastLogin = moment(last_login).format('YYYY-MM-DD HH:mm:ss');

    const query = 'INSERT INTO users (username, user_role, status, social_profile, promote, rating, last_login) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [username, user_role, status, JSON.stringify(social_profile), promote, rating, formattedLastLogin], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(201).send({ id: result.insertId });
    });
});

app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).json(results);
    });
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, user_role, status, social_profile, promote, rating, last_login } = req.body;

    // Convert last_login to MySQL DATETIME format
    const formattedLastLogin = moment(last_login).format('YYYY-MM-DD HH:mm:ss');

    const query = 'UPDATE users SET username = ?, user_role = ?, status = ?, social_profile = ?, promote = ?, rating = ?, last_login = ? WHERE id = ?';
    db.query(query, [username, user_role, status, JSON.stringify(social_profile), promote, rating, formattedLastLogin, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(result);
    });
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(200).send(result);
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
