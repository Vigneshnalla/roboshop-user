const mongoClient = require('mongodb').MongoClient;

let db, usersCollection, ordersCollection, mongoConnected = false;

function mongoConnect(mongoURL) {
    return new Promise((resolve, reject) => {
        mongoClient.connect(mongoURL, (error, client) => {
            if (error) {
                reject(error);
            } else {
                db = client.db('users');
                usersCollection = db.collection('users');
                ordersCollection = db.collection('orders');
                resolve('connected');
            }
        });
    });
}

function mongoLoop(mongoURL, logger) {
    mongoConnect(mongoURL)
        .then(() => {
            mongoConnected = true;
            logger.info('MongoDB connected');
        })
        .catch((error) => {
            logger.error('ERROR', error);
            setTimeout(() => mongoLoop(mongoURL, logger), 2000);
        });
}

module.exports = {
    mongoConnect,
    mongoLoop,
    collections: { usersCollection, ordersCollection },
    getMongoStatus: () => mongoConnected,
};
