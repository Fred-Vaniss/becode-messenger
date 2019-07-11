const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;


// Connection à mongo
mongo.connect('mongodb://10.203.0.1/mongochat', (err, db) => {
    if(err) throw err

    console.log('MongoDB connected...')
});