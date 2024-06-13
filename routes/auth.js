const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectToMySQL } = require('../models/User');

const JWT_SECRET = 'Harryisagoodb$oy';

router.post('/createuser', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const connection = await connectToMySQL();
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ error: "Sorry, a user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await connection.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        const authtoken = jwt.sign({ email }, JWT_SECRET);
        res.json({ success: true, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const connection = await connectToMySQL();
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const user = rows[0];

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const authtoken = jwt.sign({ email }, JWT_SECRET);

        res.json({ success: true, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/profile', async (req, res) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const userId = decoded.email;
        const connection = await connectToMySQL();
        const [rows] = await connection.execute('SELECT username, email FROM users WHERE email = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
