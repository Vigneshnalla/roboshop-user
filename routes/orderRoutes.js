const express = require('express');
const { collections } = require('../config/mongoConfig');
const router = express.Router();

// Create Order Route
router.post('/order/:id', async (req, res) => {
    req.log.info('Creating order for user:', req.params.id);
    const { id } = req.params;
    const order = req.body;
    try {
        const user = await collections.usersCollection.findOne({ name: id });
        if (!user) return res.status(404).send('User not found');

        const orderHistory = await collections.ordersCollection.findOne({ name: id });
        if (orderHistory) {
            orderHistory.history.push(order);
            await collections.ordersCollection.updateOne({ name: id }, { $set: { history: orderHistory.history } });
        } else {
            await collections.ordersCollection.insertOne({ name: id, history: [order] });
        }
        res.status(201).send('Order created successfully');
    } catch (error) {
        req.log.error('Error creating order:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get Order History Route
router.get('/history/:id', async (req, res) => {
    req.log.info('Fetching order history for user:', req.params.id);
    try {
        const history = await collections.ordersCollection.findOne({ name: req.params.id });
        if (history) {
            res.json(history);
        } else {
            res.status(404).send('Order history not found');
        }
    } catch (error) {
        req.log.error('Error fetching order history:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
