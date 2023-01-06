const mongoose = require('mongoose');
const { getMongoConfig } = require('../session/session.config');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rupert-db';

const mongooseConnect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGO_URI, getMongoConfig()).then(() => {
        console.info('MONGOOSE CONNECTION OK');
    }).catch(err => {
        console.error(err);
        process.exit();
    })    
}

module.exports = mongooseConnect;