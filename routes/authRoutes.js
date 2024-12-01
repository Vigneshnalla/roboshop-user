const express = require('express');
const { collections } = require('../config/mongoConfig');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { name, password } = req.body;
    req.log.info('login', req.body);
    try {
        const user = await collections.usersCollection.findOne({ name });
        if (user && user.password === password) {
            res.json(user);
        } else {
            res.status(404).send('Invalid credentials');
        }
    } catch (error) {
        req.log.error('ERROR', error);
        res.status(500).send(error);
    }
});

router.post('/register', async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const existingUser = await collections.usersCollection.findOne({ name });
        if (existingUser) {
            res.status(400).send('User already exists');
        } else {
            await collections.usersCollection.insertOne({ name, password, email });
            res.send('OK');
        }
    } catch (error) {
        req.log.error('ERROR', error);
        res.status(500).send(error);
    }
});

module.exports = router;
