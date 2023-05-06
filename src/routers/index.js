const { Router } = require('express')
const testRouter = require('./testrouter.js')
const authRouter = require('./authrouter.js')

const router = Router();

router.use('/test',testRouter);
router.use('/auth', authRouter);

module.exports = router;