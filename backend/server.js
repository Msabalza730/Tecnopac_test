const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const moment = require('moment'); 
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


const app = express();
app.use(cors());
app.use(bodyParser.json());

/**
 * Configuring the connection to the database
 * Creating table 'users' if it does not exist
 * Defining routes for CRUD of users
 */
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
        last_login DATETIME,
        photo VARCHAR(255)
    )
`;
db.query(createUserTable, (err, result) => {
    if (err) throw err;
    console.log('User table created or already exists');
});


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'API to manage users developed by Maryori Sabalza',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
    },
    apis: ['server.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Path to serve Swagger specification
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Path to display the Swagger UI interface
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user in the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Server Error
 */
app.post('/api/users', (req, res) => {
    const { username, user_role, status, social_profile, promote, rating, last_login, photo } = req.body;
    const formattedLastLogin = moment(last_login).format('YYYY-MM-DD HH:mm:ss');

    const query = 'INSERT INTO users (username, user_role, status, social_profile, promote, rating, last_login, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [username, user_role, status, JSON.stringify(social_profile), promote, rating, formattedLastLogin, photo], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).send(err);
            return;
        }
        res.status(201).send({ id: result.insertId });
    });
});


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Gets all users in the database
 *     responses:
 *       '200':
 *         description: User list successfully obtained
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Server Error
 */
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


/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update an existing user
 *     description: AUpdate a user's data in the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Server Error
 */
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, user_role, status, social_profile, promote, rating, last_login, photo } = req.body;
    const formattedLastLogin = moment(last_login).format('YYYY-MM-DD HH:mm:ss');

    const query = 'UPDATE users SET username = ?, user_role = ?, status = ?, social_profile = ?, promote = ?, rating = ?, last_login = ?, photo = ? WHERE id = ?';
    db.query(query, [username, user_role, status, JSON.stringify(social_profile), promote, rating, formattedLastLogin, photo, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).send(err);
            return;
        }
        res.status(200).send(result);
    });
});


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user from database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Delete user with success
 *       '500':
 *         description: Server Error
 */
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
