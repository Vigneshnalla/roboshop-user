const express = require('express');
const bcrypt = require('bcrypt');
const { collections } = require('../config/mongoConfig');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    req.log.info('Login attempt for user:', name);
    try {
        const user = await collections.usersCollection.findOne({ name });
        if (user && await bcrypt.compare(password, user.password)) {
            res.json(user);
        } else {
            res.status(404).send('Invalid credentials');
        }
    } catch (error) {
        req.log.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Register Route
router.post('/register', async (req, res) => {
    const { name, password, email } = req.body;
    req.log.info('Registering user:', name);
    try {
        const existingUser = await collections.usersCollection.findOne({ name });
        if (existingUser) {
            res.status(400).send('User already exists');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing
            await collections.usersCollection.insertOne({ name, password: hashedPassword, email });
            res.send('OK');
        }
    } catch (error) {
        req.log.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
