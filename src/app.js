const express = require('express');
const LogMiddeware = require('./middlewares/LogMiddleware');
const ErrorMiddeware = require('./middlewares/ErrorMiddleware');
const router = require('./routers');
const HereAPIService = require('./services/HereAPIService');

const app = express()
const port = 3000 

app.use(express.urlencoded({extended: true}))
app.use(express.json({extended: true}))

// TODO remove
// HereAPIService.getAddresses("ngagel jaya tengah").then((r) => console.log(r));
// HereAPIService.getCoords("Knowhere").then((r) => console.log(r));

app.use(LogMiddeware);

// load API router
app.use("/api",router);

app.use(ErrorMiddeware);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`App listening on port ${port}!`))

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        console.log('HTTP server closed')
    })
})