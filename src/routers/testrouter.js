const { Router } = require("express");
const TestController = require("../controllers/TestController.js");

const router = Router();

router.get("/",TestController.hello);
// router.get('/', (req, res) => res.send('Hello World!'));


module.exports = router;