class TestController {
    static hello(req, res) {
        return res.status(200).send("Hello World!");
    }
}

module.exports = TestController;