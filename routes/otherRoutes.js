const express = require('express');
const { collections } = require('../config/mongoConfig');
const redisClient = require('../config/redisClient'); // Ensure redisClient is correctly imported
const router = express.Router();

// Check if user exists
router.get('/check/:id', async (req, res) => {
    req.log.info('Checking user:', req.params);
    const { id } = req.params;
    try {
        const user = await collections.usersCollection.findOne({ name: id });
        if (user) {
            res.send('OK');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        req.log.error('Error:', error);
        res.status(500).send(error);
    }
});

// Return all users (for debugging)
router.get('/users', async (req, res) => {
    req.log.info('Fetching all users');
    try {
        const users = await collections.usersCollection.find().toArray();
        res.json(users);
    } catch (error) {
        req.log.error('Error fetching users:', error);
        res.status(500).send(error);
    }
});

// Generate unique anonymous ID using Redis
router.get('/uniqueid', (req, res) => {
    req.log.info('Generating unique ID');
    redisClient.incr('anonymous-counter', (err, r) => {
        if (!err) {
            res.json({ uuid: 'anonymous-' + r });
        } else {
            req.log.error('Redis error:', err);
            res.status(500).send(err);
        }
    });
});


router.all('*', (req, res) => {
    res.status(404).send('Route not found');
});
module.exports = router;
