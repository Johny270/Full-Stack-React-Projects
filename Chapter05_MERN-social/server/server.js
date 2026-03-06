import config from './../config/config.js'
import app from './express.js'
import mongoose from 'mongoose'

app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
})

mongoose.promise = global.Promise
// mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
// mongoose.connection.on('error', () => {
//     throw new Error(`Unable to connect to database: ${config.mongoUri}`)
// })

mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.info("Connected to the database: %s", config.mongoUri)
    })
    .catch((err) => {
        console.error("Failed to connect to the database!")
        console.error(err)
    })