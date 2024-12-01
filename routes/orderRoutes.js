const express = require('express');
const { collections } = require('../config/mongoConfig');
const router = express.Router();

router.post('/order/:id', async (req, res) => {
    req.log.info('order', req.body);
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
        res.send('OK');
    } catch (error) {
        req.log.error('ERROR', error);
        res.status(500).send(error);
    }
});

router.get('/history/:id', async (req, res) => {
    req.log.info('order', req.body);
    try {
        const history = await collections.ordersCollection.findOne({ name: req.params.id });
        history ? res.json(history) : res.status(404).send('History not found');
    } catch (error) {
        req.log.error('ERROR', error);
        res.status(500).send(error);
    }
});

module.exports = router;
