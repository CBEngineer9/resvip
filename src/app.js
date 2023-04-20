const express = require('express');
const LogMiddeware = require('./middlewares/LogMiddleware');
const ErrorMiddeware = require('./middlewares/ErrorMiddleware');
const router = require('./routers');

const app = express()
const port = 3000

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