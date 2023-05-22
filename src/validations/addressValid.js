const HereAPIService = require("../services/HereAPIService");

async function addressValid(value, helpers) {
    const addr = await HereAPIService.getAddresses(value)
    if (value != addr[0]) {
        return addr[0];
    }
}

module.exports = addressValid