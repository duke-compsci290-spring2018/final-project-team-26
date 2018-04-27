// setup database
import { db } from './models/database'
if (db) {
    console.log('Successfully connected to database')
}
else {
    console.log('Could not connect to the database. Exiting now...')
    process.exit()
}


// use Express as our router
import Express from 'express'
import BodyParser from 'body-parser'
import Cors from 'cors'

// create express app
const app = Express()
// allow requests from any domain, no cross site concerns
app.use(Cors())
// parse form data more easily
app.use(BodyParser.urlencoded({ extended: true }))
// parse JSON form data
app.use(BodyParser.json())


// our local code that will respond to URL requests
import Video from "./controllers/video.js";

// list of URLs (and their protocols) that this server responds to
// sends analysis requests to Watson API, returns results to client
app.get('/analyze', Video.requestAnalysis)
//returns record of searched video's in database
app.get('/searched', Video.reportSearched)
// adds a new video to the database's record of searches
app.post('/searched', Video.addVideo)
// delete given book
app.delete('/searched/:key', Video.removeVideo)
// nothing useful for root URL to do
app.get('/', (req, res) => {
    res.json({"message": 'Welcome to the YouTube Comment Analyzer!'})
    res.end()
})


// get important variables that change frequently
import { PORT } from './config'

// start server to listen for requests
app.listen(PORT, function() {
    console.log(`Server is listening on port http://${this.address().address}:${this.address().port}`);
})