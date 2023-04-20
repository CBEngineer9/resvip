const { Router } = require('express')
const testRouter = require('./testrouter.js')

const router = Router();

router.use('/test',testRouter);

module.exports = router;