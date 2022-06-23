const mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL
mongoose.connection.once('open', ()=>{
    console.log('Mongo connected')
})

mongoose.connection.on('error', err => { // mongoose connect to database
    console.log(err);
  });

const connectMongo = async ()=>{
    await mongoose.connect(MONGO_URL)
}

const disconnectMongo = async ()=>{
    await mongoose.disconnect()
}

module.exports = {
    connectMongo,
    disconnectMongo
}