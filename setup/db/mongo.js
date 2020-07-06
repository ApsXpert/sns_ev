import mongoose from 'mongoose';
import config from 'config';

import logger from '../logger';

/*let connectionString = config.get('configurations.mongoURL') + config.get('configurations.mongoDB');
config.util.getEnv('NODE_ENV') !== 'local' ? connectionString += '?authSource=admin' : null;*/

let connectionString = 'mongodb://localhost:27017/sns_ev';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoReconnect: true,
    socketTimeoutMS: 30000 * 2,
    connectTimeoutMS: 30000 * 2,
    reconnectTries: 10,
    reconnectInterval: 60
}, (error, db) => {
    if (error && !db) {
        logger.error(`Unable to esablish connection with MongoDB, reason -> [ ${error.message} ]`);
    } else {
        logger.info('Successfully connected with MongoDB');
    }
});

const db = mongoose.connection;

export default db;