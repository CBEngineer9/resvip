const { Router } = require('express')
const testRouter = require('./testrouter.js')
const authRouter = require('./authrouter.js');
const seekerRouter = require('./seekerRouter.js');
const AuthMiddleware = require('../middlewares/AuthMiddleware.js');

const router = Router();

router.use('/test',testRouter);
router.use('/auth', authRouter);
router.use('/seeker', [AuthMiddleware], seekerRouter);

module.exports = router;