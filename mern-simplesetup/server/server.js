import express from 'express'
import devBundle from './devBundle'
import path from 'path'
import template from './../template'
import { MongoClient } from 'mongodb'

const app = express()
devBundle.compile(app)

const CURRENT_WORKING_DIR = process.cwd()
// This will configure the Express app to return static files from the dist
// folder when the requested route starts with /dist.
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

app.get('/', (req, res) => {
    res.status(200).send(template())
})

// start a server that listens on the specified port for incoming requests
let port = process.env.PORT || 3000
app.listen(port, function onStart(err) {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', port)
})

// Connecting server to MongoDB
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/mernSimpleSetup'
MongoClient.connect(url, (err, db) => {
    console.log("Connected successfully to mongodb server")
    if (db) {
        db.close()
    }
})