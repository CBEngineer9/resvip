class testController {
    static hello(req, res) {
        return res.status(200).send("Hello World!");
    }
}

module.exports = testController;