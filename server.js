require('dotenv').config()
const http = require('http')
const app = require('./app')
const {connectMongo} = require('./services/mongo')
const PORT = process.env.PORT

const server = http.createServer(app)

const startServer = async ()=>{
    try {
        await connectMongo()
        server.listen(PORT, ()=>{
            console.log('Listening on port: ', PORT)
        })
    }catch(err){
        console.log(err)
    }
}

startServer()