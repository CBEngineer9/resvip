const { Router } = require('express')
const testRouter = require('./testrouter.js')
const authRouter = require('./authrouter.js');
const seekerRouter = require('./seekerRouter.js');

const router = Router();

router.use('/test',testRouter);
router.use('/auth', authRouter);
router.use('/seeker', seekerRouter);

module.exports = router;