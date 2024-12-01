require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('pino');
const expPino = require('express-pino-logger');
const { mongoLoop, getMongoStatus } = require('./config/mongoConfig');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const otherRoutes = require('./routes/otherRoutes');

// Initialize Express App
const app = express();

// Logger
const logger = pino({ level: 'info', prettyPrint: false });
app.use(expPino({ logger }));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.set('Timing-Allow-Origin', '*');
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ app: 'OK', mongo: getMongoStatus() });
});

// Routes
app.use(authRoutes);
app.use(orderRoutes);
app.use('*', otherRoutes);  // This catches all other routes


// MongoDB Connection
const mongoURL = process.env.MONGO_URL || 'mongodb://mongodb:27017/users';
mongoLoop(mongoURL, logger);

// Start the Server
const port = process.env.USER_SERVER_PORT || '8080';
app.listen(port, () => logger.info(`Server started on port ${port}`));
