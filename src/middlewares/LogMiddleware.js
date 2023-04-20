const chalk = require("chalk");

function LogMiddeware(req, res, next) {
    res.on('finish', () => {
        const status_code = res.statusCode;
        const method = req.method;
        let logMessage = `${chalk.green(method)} ${req.originalUrl} - ${chalk.blue(status_code)}`
        console.log(logMessage);
    })
    
    next();
}

module.exports = LogMiddeware